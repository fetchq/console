const schema = require('./v1-queues-list.schema');

/**
 * GET://v1/cron?
 * group=mpeg
 * limit=10
 */
const v1QueuesList = {
  method: 'GET',
  url: '/api/v1/queues/',
  schema,
  handler: async (request, reply) => {
    const { query } = request;
    const fetchq = request.getContext('fetchq');

    const sql = [];
    const where = [];
    sql.push(`SELECT * FROM "fetchq"."queues"`);

    if (query.cursor) {
      where.push(`"id" > ${query.cursor}`);
    }

    if (where.length) {
      sql.push(`WHERE`);
      sql.push(where.join(' AND '));
    }

    sql.push(`ORDER BY "name" ASC`);

    if (query.limit) {
      sql.push(`LIMIT ${query.limit}`);
    }

    const _sql = sql.join(' ');
    const res = await fetchq.pool.query(_sql);

    reply.send({
      success: true,
      data: {
        items: res.rows,
        _sql,
      },
    });
  },
};

module.exports = { v1QueuesList };
