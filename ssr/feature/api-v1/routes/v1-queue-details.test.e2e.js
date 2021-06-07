describe('v1QueueDetails', () => {
  beforeEach(global.dropAllQueues);

  const getMetric = (metric) => ($) => $.metric === metric;

  it('should throw error in case the queue does not exists', async () => {
    const onError = jest.fn();
    try {
      await global.get('/api/v1/queues/q1');
    } catch (err) {
      onError(err);
    }
    expect(onError.mock.calls.length).toBe(1);
    expect(onError.mock.calls[0][0].response.status).toBe(404);
    expect(onError.mock.calls[0][0].response.data.success).toBe(false);
  });

  it('should load a queue details', async () => {
    await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);
    await global.fetchq.query(`SELECT * FROM fetchq.doc_append('q1', '{}')`);
    await global.fetchq.query(`SELECT * FROM fetchq.mnt()`);
    const r1 = await global.get('/api/v1/queues/q1');
    expect(r1.data.queue.name).toBe('q1');
    expect(r1.data.metrics.find(getMetric('cnt')).current_value).toBe(1);
  });
});
