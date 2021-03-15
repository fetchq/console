const schema = require('./v1-document-play.schema');

const getUpdateMetricsSql = (queueName, prevStatus) => {
  if (prevStatus === 2) {
    return `
      SELECT FROM "fetchq"."metric_log_increment"('${queueName}', 'pnd', 1);
      SELECT FROM "fetchq"."metric_log_decrement"('${queueName}', 'act', 1);
    `;
  }
  if (prevStatus === 0) {
    return `
      SELECT FROM "fetchq"."metric_log_increment"('${queueName}', 'pnd', 1);
      SELECT FROM "fetchq"."metric_log_decrement"('${queueName}', 'pln', 1);
    `;
  }
};

/**
 * POST://api/v1/queues/:name/play/:subject
 */
const v1QueueDocumentPlay = {
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
      const _sqlMetrics = getUpdateMetricsSql(params.name, doc.status_prev);
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

module.exports = { v1QueueDocumentPlay };
