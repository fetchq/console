const schema = require('./v1-queue-docs.schema');

const retrieveDocuments = async (query, params, fetchq) => {
  const sql = [];
  const where = [];

  sql.push(
    `SELECT subject, status, version, priority, attempts, iterations, next_iteration, created_at, last_iteration FROM "fetchq_data"."${params.name}__docs"`,
  );

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

const retrievePagination = async (query, params, items, fetchq) => {
  const _sql = `SELECT * FROM "fetchq"."metric_get"('${params.name}', 'cnt')`;
  const result = await fetchq.pool.query(_sql);

  return [
    {
      count: result.rows[0].does_exists ? result.rows[0].current_value : null,
      ...query,
    },
    _sql,
  ];
};

/**
 * GET://v1/queues/:name/documents
 */
const v1QueueDocs = {
  method: 'GET',
  url: '/api/v1/queues/:name/docs',
  schema,
  handler: async (request, reply) => {
    const { query, params } = request;
    const fetchq = request.getContext('fetchq');

    try {
      const [items, itemsSql] = await retrieveDocuments(query, params, fetchq);
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

module.exports = { v1QueueDocs };
