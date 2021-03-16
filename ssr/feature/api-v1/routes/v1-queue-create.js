const schema = require('./v1-queue-create.schema');

const v1QueueCreate = {
  method: 'POST',
  url: '/api/v1/queues',
  schema,
  handler: async (request, reply) => {
    const fetchq = request.getContext('fetchq');
    const {
      body: { name },
    } = request;

    // TODO: validate queue name
    // The queue name validation will be handled in a future
    // story, bound to a fetchq-client story to export the
    // validation function as "fetchq.utils.validateQueueName()"
    // if (name.includes('-')) {
    //   reply.status(422).send({
    //     success: false,
    //     errors: [{ message: 'Invalid queue name' }],
    //   });
    // }

    const sqlCreate = `SELECT * FROM "fetchq"."queue_create"('${name}');`;
    const resCreate = await fetchq.pool.query(sqlCreate);

    reply.send({
      success: true,
      data: {
        ...resCreate.rows[0],
        _sql: [sqlCreate],
      },
    });
  },
};

module.exports = { v1QueueCreate };
