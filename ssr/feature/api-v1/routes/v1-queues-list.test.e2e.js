const { Replay10 } = require('@material-ui/icons');

describe('v1QueuesList', () => {
  beforeEach(global.resetSchema);

  it('should return a list of queues', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    const r1 = await global.get('/api/v1/queues');
    expect(r1.data.items[0].id).toBe(1);
    expect(r1.data.items[0].name).toBe('q1');
    expect(r1.data.items[0].cnt).toBe(0);
  });
});
