const schema = require('./v1-queue-logs.schema');

const retrieveItems = async (query, params, fetchq) => {
  const sql = [];
  const where = [];

  sql.push(`SELECT * FROM "fetchq_data"."${params.name}__logs"`);

  // if (query.cursor) {
  //   where.push(
  //     `${query.order} ${query.dir === 'asc' ? '>' : '<'} '${query.cursor}'`,
  //   );
  // }

  if (where.length) {
    sql.push(`WHERE`);
    sql.push(where.join(' AND '));
  }

  sql.push(`ORDER BY "${query.order}" ${query.direction.toUpperCase()}`);
  sql.push(`LIMIT ${query.limit}`);
  sql.push(`OFFSET ${query.limit * query.offset}`);

  const _sql = sql.join(' ');
  const items = await fetchq.pool.query(_sql);

  return [items.rows, _sql];
};

/**
 * This solution to SELECT COUNT(*) is explained it this article:
 * https://www.cybertec-postgresql.com/en/speeding-up-count-why-not-use-maxid-minid/
 *
 * I decided to keep it anyway because in this table we meet the following conditions:
 * - there is no failure in insert as we append only
 * - there is no deletion from the middle as we delete old data only
 *
 * For the purpose of paginating the logs table, this should be just fine :-)
 */
const retrievePagination = async (query, params, items, fetchq) => {
  const _sql = `SELECT MAX("id") - MIN("id") + 1 AS count FROM "fetchq_data"."q1__logs"`;
  const result = await fetchq.pool.query(_sql);

  return [
    {
      count: result.rows[0].count,
      ...query,
    },
    _sql,
  ];
};

/**
 * GET://v1/queues/:name/logs
 */
const v1QueueLogs = {
  method: 'GET',
  url: '/api/v1/queues/:name/logs',
  schema,
  handler: async (request, reply) => {
    const { query, params } = request;
    const fetchq = request.getContext('fetchq');

    try {
      const [items, itemsSql] = await retrieveItems(query, params, fetchq);
      const [pagination, paginationSql] = await retrievePagination(
        query,
        params,
        items,
        fetchq,
      );

      reply.send({
        success: true,
        data: {
          pagination,
          items,
          _sql: [itemsSql, paginationSql].join('\n'),
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

module.exports = { v1QueueLogs };
