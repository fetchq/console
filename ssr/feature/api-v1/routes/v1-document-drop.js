const schema = require('./v1-document-drop.schema');

const getMetricsToDecrease = ({ status_prev, version_prev }) => {
  const queries = ['cnt', `v${version_prev}`];

  switch (status_prev) {
    case 3:
      queries.push('cpl');
      break;
    case 2:
      queries.push('act');
      break;
    case 1:
      queries.push('pnd');
      break;
    case 0:
      queries.push('pln');
      break;
    case -1:
      queries.push('kll');
      break;
  }

  return queries;
};

const buildDecrementSql = (queueName) => (metric) =>
  `SELECT FROM "fetchq"."metric_log_decrement"('${queueName}', '${metric}', 1);`;

const v1DocumentDrop = {
  method: 'POST',
  url: '/api/v1/queues/:name/drop/:subject',
  schema,
  handler: async (request, reply) => {
    const { query, params } = request;
    const fetchq = request.getContext('fetchq');

    try {
      const _sql = `
        DELETE FROM "fetchq_data"."${params.name}__docs"
        WHERE "subject" = '${params.subject}'
        RETURNING status AS status_prev, version AS version_prev;
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

      // Update the metrics according to the previous status of the document:
      const toSql = buildDecrementSql(params.name);
      const _sqlMetrics = getMetricsToDecrease(res.rows[0]).map(toSql).join('');
      _sqlMetrics && (await fetchq.pool.query(_sqlMetrics));

      reply.send({
        success: true,
        data: {
          _sql: [_sql, ..._sqlMetrics].join('\n'),
        },
      });
    } catch (err) {
      console.log(err);
      reply.status(404).send({
        success: false,
        errors: [{ message: `queue "${params.name}" does not exists` }],
      });
    }
  },
};

module.exports = { v1DocumentDrop };
