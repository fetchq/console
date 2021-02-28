const schema = require('./v1-queue-details.schema');

const makeQueuesSql = (name) => {
  const sql = [];
  const where = [];
  sql.push(`SELECT * FROM "fetchq"."queues"`);

  where.push(`"name" = '${name}'`);

  if (where.length) {
    sql.push(`WHERE`);
    sql.push(where.join(' AND '));
  }

  sql.push(`LIMIT 1`);

  return sql.join(' ');
};

const makeMetricsSql = (name) =>
  `SELECT * FROM "fetchq"."metric_get"('${name}')`;

/**
 * GET://v1/queues/:name
 */
const v1QueueDetails = {
  method: 'GET',
  url: '/api/v1/queues/:name',
  schema,
  handler: async (request, reply) => {
    const fetchq = request.getContext('fetchq');
    const {
      params: { name },
    } = request;

    // Load queue details:
    const _queuesSql = makeQueuesSql(name);
    const r1 = await fetchq.pool.query(_queuesSql);

    if (!r1.rowCount) {
      reply.status(404).send({
        success: false,
        errors: [
          {
            message: `queue "${name}" not found`,
          },
        ],
      });
    }

    // Load queue metrics:
    const _metricsSql = makeMetricsSql(name);
    const r2 = await fetchq.pool.query(_metricsSql);

    reply.send({
      success: true,
      data: {
        queue: r1.rows[0],
        metrics: r2.rows,
        _sql: [_queuesSql, _metricsSql].join('\n'),
      },
    });
  },
};

module.exports = { v1QueueDetails };
