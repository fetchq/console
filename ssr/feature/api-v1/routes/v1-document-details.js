const schema = require('./v1-document-details.schema');

const v1DocumentDetails = {
  method: 'GET',
  url: '/api/v1/queues/:name/doc/:subject',
  schema,
  handler: async (request, reply) => {
    const { query, params } = request;
    const fetchq = request.getContext('fetchq');

    try {
      const _sql = `
        SELECT * FROM "fetchq_data"."${params.name}__docs"
        WHERE "subject" = '${params.subject}'
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
      console.log(err);
      reply.status(404).send({
        success: false,
        errors: [{ message: `queue "${params.name}" does not exists` }],
      });
    }
  },
};

module.exports = { v1DocumentDetails };
