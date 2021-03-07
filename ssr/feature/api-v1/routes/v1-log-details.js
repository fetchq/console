const schema = require('./v1-log-details.schema');

const v1LogDetails = {
  method: 'GET',
  url: '/api/v1/queues/:name/logs/:id',
  schema,
  handler: async (request, reply) => {
    const { query, params } = request;
    const fetchq = request.getContext('fetchq');

    try {
      const _sqlLog = `
        SELECT * FROM "fetchq_data"."${params.name}__logs"
        WHERE "id" = '${params.id}'
        `;

      const res = await fetchq.pool.query(_sqlLog);

      // Handle subject or queue not existing
      if (!res.rowCount) {
        return reply.status(404).send({
          success: false,
          errors: [
            {
              message: `log "${params.id}" does not exists`,
            },
          ],
        });
      }

      const log = res.rows[0];

      const _sqlNext = `
          SELECT "id" FROM "fetchq_data"."${params.name}__logs"
          WHERE id < '${log.id}'
          ORDER BY "id" DESC
          LIMIT 1;
        `;

      const _sqlPrev = `
          SELECT "id" FROM "fetchq_data"."${params.name}__logs"
          WHERE id > '${log.id}'
            ORDER BY "id" ASC
          LIMIT 1;
        `;

      const edges = await Promise.all([
        fetchq.pool.query(_sqlPrev),
        fetchq.pool.query(_sqlNext),
      ]);

      reply.send({
        success: true,
        data: {
          log,
          prevLog: edges[0].rowCount ? edges[0].rows[0].id : null,
          nextLog: edges[1].rowCount ? edges[1].rows[0].id : null,
          _sql: [_sqlLog, _sqlPrev, _sqlNext].join('\n'),
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

module.exports = { v1LogDetails };
