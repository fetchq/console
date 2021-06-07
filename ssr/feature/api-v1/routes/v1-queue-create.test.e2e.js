describe('v1QueueCreate', () => {
  beforeEach(global.dropAllQueues);

  const q1 = { name: 'q1' };

  it('should create a new queue', async () => {
    const r1 = await global.post('/api/v1/queues', q1);
    expect(r1.data.was_created).toBe(true);
  });

  it('should not create the queue twice', async () => {
    await global.post('/api/v1/queues', q1);
    const r1 = await global.post('/api/v1/queues', q1);
    expect(r1.data.was_created).toBe(false);
  });

  // The queue name validation will be handled in a future
  // story, bound to a fetchq-client story to export the
  // validation function as "fetchq.utils.validateQueueName()"
  it.skip('should detect a queue name error', async () => {
    const onError = jest.fn();
    try {
      await global.post('/api/v1/queues', { name: 'foo-bar' });
    } catch (err) {
      onError(err);
    }
    expect(onError.mock.calls.length).toBe(1);
    expect(onError.mock.calls[0][0].response.status).toBe(422);
    expect(onError.mock.calls[0][0].response.data.success).toBe(false);
  });
});
