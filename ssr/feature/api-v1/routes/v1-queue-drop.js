const schema = require('./v1-queue-drop.schema');

/**
 * DELETE://api/v1/queues/:name
 */
const v1QueueDrop = {
  method: 'DELETE',
  url: '/api/v1/queues/:name',
  schema,
  handler: async (request, reply) => {
    const { params } = request;
    const fetchq = request.getContext('fetchq');

    try {
      const _sql = `SELECT * FROM "fetchq"."queue_drop"('${params.name}')`;
      const res = await fetchq.pool.query(_sql);

      reply.send({
        success: true,
        data: {
          ...res.rows[0],
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

module.exports = { v1QueueDrop };
