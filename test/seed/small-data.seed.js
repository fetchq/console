const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require('unique-names-generator');

describe('Seed: Small Data', () => {
  beforeEach(global.resetSchema);

  const queueCreate = (queue) =>
    global.query(`SELECT * FROM fetchq.queue_create('${queue}')`);

  const docAppend = (queue, payload) =>
    global.query(
      `SELECT * FROM fetchq.doc_append('${queue}', '${JSON.stringify(
        payload,
      )}')`,
    );

  const docPick = async (queue, lock = '5s') => {
    const res = await global.query(
      `SELECT * FROM fetchq.doc_pick('${queue}', 0, 1, '${lock}')`,
    );
    return res.rows[0];
  };

  const docReschedule = (queue, doc, nextIteration = '1d') =>
    global.query(
      `SELECT * FROM fetchq.doc_reschedule('${queue}', '${doc.subject}', NOW() + INTERVAL '${nextIteration}')`,
    );

  const docComplete = (queue, doc) =>
    global.query(
      `SELECT * FROM fetchq.doc_complete('${queue}', '${doc.subject}')`,
    );

  const docKill = (queue, doc) =>
    global.query(`SELECT * FROM fetchq.doc_kill('${queue}', '${doc.subject}')`);

  const docDrop = (queue, doc) =>
    global.query(`SELECT * FROM fetchq.doc_drop('${queue}', '${doc.subject}')`);

  const docReject = (
    queue,
    doc,
    message = 'rejected',
    details = { because: 'it was rejected' },
  ) =>
    global.query(
      `SELECT * FROM fetchq.doc_reject('${queue}', '${
        doc.subject
      }', '${message}', '${JSON.stringify(details)}')`,
    );

  const logError = (
    queue,
    doc,
    message = 'error',
    details = { because: 'shit happens' },
  ) =>
    global.query(
      `SELECT * FROM fetchq.log_error('${queue}', '${
        doc.subject
      }', '${message}', '${JSON.stringify(details)}')`,
    );

  it('Should make a query to PostgreSQL', async () => {
    jest.setTimeout(1000 * 60 * 60);

    const numQueues = 4;
    const numDocuments = 50;

    // Create a bunch of queues:
    for (let i = 0; i < numQueues; i++) {
      const queue = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
      });
      await queueCreate(queue);

      // Create a bunch of documents:
      for (let j = 0; j < numDocuments; j++) {
        await docAppend(queue, {
          i,
          name: uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
          }),
        });
      }

      // Process a bunch of documents:
      for (let k = 0; k < numDocuments; k++) {
        const doc = await docPick(queue);
        const action = global.random(1, 8);
        try {
          switch (action) {
            case 1:
              console.log('@ Drop', doc.subject);
              await docDrop(queue, doc);
            case 2:
              console.log('@ Reschedule', doc.subject);
              await docReschedule(queue, doc);
            case 3:
              console.log('@ Complete', doc.subject);
              await docComplete(queue, doc);
            case 4:
              console.log('@ Kill', doc.subject);
              await docKill(queue, doc);
            case 5:
            case 6:
            case 7:
              console.log('@ Reject', doc.subject);
              const message = uniqueNamesGenerator({
                dictionaries: [adjectives, animals],
              });
              const reason = uniqueNamesGenerator({
                dictionaries: [adjectives, animals],
              });
              await docReject(queue, doc, message, {
                action: 'rejected',
                reason,
              });
            default:
              console.log('@ Let the doc orphan');
              const message1 = uniqueNamesGenerator({
                dictionaries: [adjectives, animals],
              });
              const reason1 = uniqueNamesGenerator({
                dictionaries: [adjectives, animals],
              });
              await logError(queue, doc, message1, {
                action: 'orphan',
                reason: reason1,
              });
          }
          await global.query('SELECT FROM fetchq.mnt()');
        } catch (err) {
          console.log(err);
          process.kill(-1);
        }
      }
    }
  });
});
