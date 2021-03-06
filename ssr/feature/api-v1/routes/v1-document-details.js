const schema = require('./v1-document-details.schema');

const v1DocumentDetails = {
  method: 'GET',
  url: '/api/v1/queues/:name/docs/:subject',
  schema,
  handler: async (request, reply) => {
    const { query, params } = request;
    const fetchq = request.getContext('fetchq');

    try {
      const _sqlDoc = `
        SELECT * FROM "fetchq_data"."${params.name}__docs"
        WHERE "subject" = '${params.subject}'
        `;

      const res = await fetchq.pool.query(_sqlDoc);

      // Handle subject or queue not existing
      if (!res.rowCount) {
        return reply.status(404).send({
          success: false,
          errors: [
            {
              message: `document "${params.subject}" does not exists`,
            },
          ],
        });
      }

      const doc = res.rows[0];
      const nextIteration = String(doc.next_iteration.toISOString());

      const _sqlPrev = `
        SELECT "subject" FROM "fetchq_data"."${params.name}__docs"
        WHERE status IN (0, 1, 2)
          AND next_iteration < '${nextIteration}'
          AND subject != '${doc.subject}'
        ORDER BY "next_iteration" ASC
        LIMIT 1;
      `;

      const _sqlNext = `
        SELECT "subject" FROM "fetchq_data"."${params.name}__docs"
        WHERE status IN (0, 1, 2)
          AND next_iteration > '${nextIteration}'
          AND subject != '${doc.subject}'
          ORDER BY "next_iteration" ASC
        LIMIT 1;
      `;

      const edges = await Promise.all([
        fetchq.pool.query(_sqlPrev),
        fetchq.pool.query(_sqlNext),
      ]);

      reply.send({
        success: true,
        data: {
          doc,
          prevDoc: edges[0].rowCount ? edges[0].rows[0].subject : null,
          nextDoc: edges[1].rowCount ? edges[1].rows[0].subject : null,
          _sql: [_sqlDoc, _sqlPrev, _sqlNext].join('\n'),
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

module.exports = { v1DocumentDetails };
