const schema = require('./v1-queue-documents.schema');

const retrieveDocuments = async (query, params, fetchq) => {
  const sql = [];
  const where = [];

  sql.push(`SELECT * FROM "fetchq_data"."${params.name}__docs"`);

  if (query.cursor) {
    where.push(
      `${query.order} ${query.dir === 'asc' ? '>' : '<'} '${query.cursor}'`,
    );
  }

  if (where.length) {
    sql.push(`WHERE`);
    sql.push(where.join(' AND '));
  }

  sql.push(`ORDER BY "${query.order}" ${query.dir.toUpperCase()}`);
  sql.push(`LIMIT ${query.limit}`);

  const _sql = sql.join(' ');
  const items = await fetchq.pool.query(_sql);

  return [items.rows, _sql];
};

const retrievePagination = async (query, params, items, fetchq) => {
  const _sql = `SELECT * FROM "fetchq"."metric_get"('${params.name}', 'cnt')`;
  const result = await fetchq.pool.query(_sql);
  const itemsCount = result.rows[0].current_value;

  const pageSize = query.limit;
  const pagesCount = Math.ceil(itemsCount / pageSize);

  // Fill
  const hasNext = items.length === pageSize;
  const cursorStart = items.length ? items[0][query.order] : '';
  const cursorEnd = items.length ? items[items.length - 1][query.order] : '';

  return [
    {
      itemsCount,
      pagesCount,
      pageSize,
      cursorStart,
      cursorEnd,
      hasNext,
    },
    _sql,
  ];
};

/**
 * GET://v1/queues/:name/documents
 */
const v1QueueDocuments = {
  method: 'GET',
  url: '/api/v1/queues/:name/documents',
  schema,
  handler: async (request, reply) => {
    const { query, params } = request;
    const fetchq = request.getContext('fetchq');

    try {
      const [items, itemsSql] = await retrieveDocuments(query, params, fetchq);
      const [pages, pagesSql] = await retrievePagination(
        query,
        params,
        items,
        fetchq,
      );

      reply.send({
        success: true,
        data: {
          pages,
          items,
          _sql: [itemsSql, pagesSql].join('\n'),
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

module.exports = { v1QueueDocuments };
