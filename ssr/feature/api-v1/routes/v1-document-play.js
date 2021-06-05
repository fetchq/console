const schema = require('./v1-document-play.schema');

const getUpdateMetricsSql = ({ status_prev }) => {
  const increment = [];
  const decrement = [];

  switch (status_prev) {
    case 3:
      increment.push('pnd');
      decrement.push('cpl');
      break;
    case 2:
      increment.push('pnd');
      decrement.push('act');
      break;
    case 0:
      increment.push('pnd');
      decrement.push('pln');
      break;
    case -1:
      increment.push('pnd');
      decrement.push('kll');
      break;
  }

  return [increment, decrement];
};

const buildMetricSql = (queueName, action) => (metric) =>
  `SELECT FROM "fetchq"."metric_log_${action}"('${queueName}', '${metric}', 1);`;

/**
 * POST://api/v1/queues/:name/play/:subject
 */
const v1DocumentPlay = {
  method: 'POST',
  url: '/api/v1/queues/:name/play/:subject',
  schema,
  handler: async (request, reply) => {
    const { query, params } = request;
    const fetchq = request.getContext('fetchq');

    try {
      const _sql = `
        UPDATE "fetchq_data"."${params.name}__docs" AS "tNew"
        SET "next_iteration" = '001-01-01 01:01:01',
            "status" = 1,
            "attempts" = 0
        FROM (
          SELECT "subject", "status" 
          FROM "fetchq_data"."${params.name}__docs" 
          WHERE "subject" = '${params.subject}'
          FOR UPDATE
        ) "tOld"
        WHERE "tNew"."subject" = "tOld"."subject"
        RETURNING "tNew".*, "tOld"."status" AS "status_prev";
      `;

      const res = await fetchq.pool.query(_sql);

      // Handle subject or queue not existing
      if (!res.rowCount) {
        return reply.status(404).send({
          success: false,
          errors: [
            {
              message: `document "${params.subject}" does not exists`,
            },
          ],
        });
      }

      const doc = res.rows[0];

      // Update the metrics according to the previous status of the document:
      const [increment, decrement] = getUpdateMetricsSql(doc);
      const _sqlMetrics = [
        ...increment.map(buildMetricSql(params.name, 'increment')),
        ...decrement.map(buildMetricSql(params.name, 'decrement')),
      ].join('');

      _sqlMetrics && (await fetchq.pool.query(_sqlMetrics));

      reply.send({
        success: true,
        data: {
          doc,
          _sql: [_sql, _sqlMetrics].join('\n'),
        },
      });
    } catch (err) {
      // console.log(err);
      reply.status(404).send({
        success: false,
        errors: [{ message: `queue "${params.name}" does not exists` }],
      });
    }
  },
};

module.exports = { v1DocumentPlay };
