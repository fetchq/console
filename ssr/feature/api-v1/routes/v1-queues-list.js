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
    sql.push(`SELECT
  "t1".*,
  COALESCE("t2"."cnt", 0) AS "cnt",
  COALESCE("t2"."pnd", 0) AS "pnd",
  COALESCE("t2"."pln", 0) AS "pln",
  COALESCE("t2"."act", 0) AS "act",
  COALESCE("t2"."cpl", 0) AS "cpl",
  COALESCE("t2"."kll", 0) AS "kll",
  COALESCE("t2"."drp", 0) AS "drp",
  COALESCE("t2"."pkd", 0) AS "pkd",
  COALESCE("t2"."prc", 0) AS "prc",
  COALESCE("t2"."res", 0) AS "res",
  COALESCE("t2"."orp", 0) AS "orp",
  COALESCE("t2"."err", 0) AS "err"
FROM "fetchq"."queues" AS "t1"
LEFT JOIN LATERAL "fetchq"."metric_get_common"("t1"."name") AS "t2" ON TRUE
    `);

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
