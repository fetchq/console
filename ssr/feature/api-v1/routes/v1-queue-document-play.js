const schema = require('./v1-queue-document-play.schema');

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
        UPDATE "fetchq_data"."${params.name}__docs"
        SET "next_iteration" = '001-01-01 01:01:01',
            "status" = 1,
            "attempts" = 0
        WHERE "subject" = '${params.subject}'
        RETURNING *
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

      reply.send({
        success: true,
        data: {
          doc: res.rows[0],
          _sql,
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
