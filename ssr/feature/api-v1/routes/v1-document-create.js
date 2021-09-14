const schema = require('./v1-document-create.schema');

const v1DocumentCreate = {
  method: 'POST',
  url: '/api/v1/queues/:queue/docs',
  schema,
  handler: async (request, reply) => {
    const { params, body } = request;
    const fetchq = request.getContext('fetchq');

    try {
      const { queue } = params;
      const { subject } = body;
      const payload = JSON.stringify(body.payload).replace(/'/g, "''''");

      const _sqlPush = subject
        ? `SELECT * FROM "fetchq"."doc_push"('${queue}', '${subject}', 0, 0, NOW(), '${payload}');`
        : `SELECT * FROM "fetchq"."doc_append"('${queue}', '${payload}');`;
      const resPush = await fetchq.pool.query(_sqlPush);

      // Get the new document
      const _sqlSelect = `SELECT * FROM "fetchq_data"."${queue}__docs" WHERE "subject" = '${
        subject || resPush.rows[0].subject
      }'`;
      const resSelect = await fetchq.pool.query(_sqlSelect);

      reply.send({
        success: true,
        data: {
          op: subject ? 'push' : 'append',
          doc: resSelect.rows[0],
          _sql: [_sqlPush, _sqlSelect],
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

module.exports = { v1DocumentCreate };
