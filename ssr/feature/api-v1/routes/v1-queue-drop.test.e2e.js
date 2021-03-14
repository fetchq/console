const { Replay10Outlined } = require('@material-ui/icons');

describe('v1QueueDrop', () => {
  beforeEach(global.resetSchema);

  it('should drop an existing queue', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    await global.query(`SELECT * FROM fetchq.doc_append('q1', '{ "idx": 1 }')`);
    await global.query(`SELECT * FROM fetchq.mnt()`);

    // The queue should be deleted
    const r1 = await global.delete('/api/v1/queues/q1');
    expect(r1.data.was_dropped).toBe(true);

    // The deletion should be idempotent
    const r2 = await global.delete('/api/v1/queues/q1');
    expect(r2.data.was_dropped).toBe(false);
  });

  it('should handle a non existing queue', async () => {
    const r1 = await global.delete('/api/v1/queues/q1');
    expect(r1.data.was_dropped).toBe(false);
  });
});
