const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require('unique-names-generator');

describe('Seeder', () => {
  beforeEach(global.resetSchema);

  const queueCreate = (queue) =>
    global.query(`SELECT * FROM fetchq.queue_create('${queue}')`);

  const docAppend = (queue, payload) =>
    global.query(
      `SELECT * FROM fetchq.doc_append('${queue}', '${JSON.stringify(
        payload,
      )}')`,
    );

  it('Should make a query to PostgreSQL', async () => {
    jest.setTimeout(1000 * 60 * 60);

    for (let i = 0; i < 4; i++) {
      const queue = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
      });
      await queueCreate(queue);
      for (let j = 0; j < 50; j++) {
        await docAppend(queue, {
          i,
          name: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
          }),
        });
      }
    }
  });
});
