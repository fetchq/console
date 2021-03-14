const schema = require('./v1-document-drop.schema');

const v1QueueDocumentDrop = {
  method: 'POST',
  url: '/api/v1/queues/:name/drop/:subject',
  schema,
  handler: async (request, reply) => {
    const { query, params } = request;
    const fetchq = request.getContext('fetchq');

    try {
      const _sql = `
        DELETE FROM "fetchq_data"."${params.name}__docs"
        WHERE "subject" = '${params.subject}';
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

      // Log decrement of the amount of items in the queue
      // this is useful to keep the pagination correct.
      const _sqlCnt = `SELECT FROM "fetchq"."metric_log_decrement"('${params.name}', 'cnt', 1)`;
      await fetchq.pool.query(_sqlCnt);

      // TODO: it should look into the status of the deleted document
      //       and update counters accordingly.

      reply.send({
        success: true,
        data: {
          _sql,
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

module.exports = { v1QueueDocumentDrop };
