describe('v1QueueDocumentPlay', () => {
  beforeEach(global.resetSchema);

  it('should play an existing document', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    await global.query(`SELECT * FROM fetchq.doc_push('q1', 's1')`);
    await global.query(`SELECT * FROM fetchq.mnt()`);
    const r1 = await global.post('/api/v1/queues/q1/play/s1');
    expect(r1.data.doc.subject).toBe('s1');
    expect(r1.data.doc.next_iteration).toBe('0001-01-01T01:01:01.000Z');
  });

  it('should handle a non existing document', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    await global.query(`SELECT * FROM fetchq.doc_push('q1', 's1')`);
    await global.query(`SELECT * FROM fetchq.mnt()`);

    const onError = jest.fn();

    try {
      await global.post('/api/v1/queues/q1/play/s2');
    } catch (err) {
      onError(err);
    }

    const calls = onError.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].response.status).toBe(404);
    expect(calls[0][0].response.data.success).toBe(false);
  });

  it('should handle a non existing queue', async () => {
    const onError = jest.fn();

    try {
      await global.post('/api/v1/queues/q1/play/s2');
    } catch (err) {
      onError(err);
    }

    const calls = onError.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].response.status).toBe(404);
    expect(calls[0][0].response.data.success).toBe(false);
  });
});
