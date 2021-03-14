describe('v1QueueDocumentDrop', () => {
  beforeEach(global.resetSchema);

  it('should drop an existing document', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    await global.query(`SELECT * FROM fetchq.doc_push('q1', 's1')`);
    await global.query(`SELECT * FROM fetchq.doc_push('q1', 's2')`);
    await global.query(`SELECT * FROM fetchq.mnt()`);

    // Before the delete there should be one item in the queue
    const _sqlCnt = `SELECT * FROM fetchq.metric_get('q1', 'cnt')`;
    const r1 = await global.query(_sqlCnt);
    expect(r1.rows[0].current_value).toBe(2);

    // The delete should remove the item
    const r2 = await global.post('/api/v1/queues/q1/drop/s1');
    expect(r2.success).toBe(true);

    // After the delete the count should be update for the queues coumt
    await global.query(`SELECT * FROM fetchq.mnt()`);
    const r3 = await global.query(_sqlCnt);
    expect(r3.rows[0].current_value).toBe(1);
  });

  it('should handle a non existing document', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    await global.query(`SELECT * FROM fetchq.doc_push('q1', 's1')`);
    await global.query(`SELECT * FROM fetchq.mnt()`);

    const onError = jest.fn();

    try {
      await global.post('/api/v1/queues/q1/drop/s2');
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
      await global.post('/api/v1/queues/q1/drop/s2');
    } catch (err) {
      onError(err);
    }

    const calls = onError.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].response.status).toBe(404);
    expect(calls[0][0].response.data.success).toBe(false);
  });
});
