describe('v1LogDetails', () => {
  beforeEach(global.dropAllQueues);

  it('should throw error in case the queue does not exists', async () => {
    const onError = jest.fn();
    try {
      await global.get('/api/v1/queues/q1/logs/1');
    } catch (err) {
      onError(err);
    }
    expect(onError.mock.calls.length).toBe(1);
    expect(onError.mock.calls[0][0].response.status).toBe(404);
    expect(onError.mock.calls[0][0].response.data.success).toBe(false);
  });

  it('should throw error in case the log entry does not exists', async () => {
    await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);
    const onError = jest.fn();
    try {
      await global.get('/api/v1/queues/q1/logs/1');
    } catch (err) {
      onError(err);
    }
    expect(onError.mock.calls.length).toBe(1);
    expect(onError.mock.calls[0][0].response.status).toBe(404);
    expect(onError.mock.calls[0][0].response.data.success).toBe(false);
  });

  it('should load a log details', async () => {
    await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);
    const doc = await global.fetchq.query(
      `SELECT * FROM fetchq.doc_append('q1', '{}')`,
    );
    await global.fetchq.query(
      `SELECT * FROM fetchq.log_error('q1', '${doc.rows[0].subject}', 'error', '{}')`,
    );
    const log = await global.fetchq.query(
      `SELECT id FROM fetchq_data.q1__logs LIMIT 1;`,
    );
    const r1 = await global.get(`/api/v1/queues/q1/logs/${log.rows[0].id}`);
    expect(r1.data.log.id).toBe(log.rows[0].id);
    expect(r1.data.log.subject).toBe(doc.rows[0].subject);
    expect(r1.data.prevLog).toBe(null);
    expect(r1.data.nextLog).toBe(null);
  });

  it('should load a log details', async () => {
    await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);
    await global.fetchq.query(`SELECT * FROM fetchq.doc_push('q1', 'foobar')`);

    await global.fetchq.query(
      `
        SELECT * FROM fetchq.log_error('q1', 'foobar', 'log1', '{"count": 1}');
        SELECT * FROM fetchq.log_error('q1', 'foobar', 'log2', '{"count": 2}');
        SELECT * FROM fetchq.log_error('q1', 'foobar', 'log3', '{"count": 3}');
        SELECT * FROM fetchq.log_error('q1', 'foobar', 'log4', '{"count": 4}');
        SELECT * FROM fetchq.log_error('q1', 'foobar', 'log5', '{"count": 5}');
        `,
    );

    const r1 = await global.get(`/api/v1/queues/q1/logs`);
    const r2 = await global.get(
      `/api/v1/queues/q1/logs/${r1.data.items[2].id}`,
    );

    expect(r2.data.log.subject).toBe('foobar');
    expect(r2.data.prevLog).toBe(r1.data.items[1].id);
    expect(r2.data.nextLog).toBe(r1.data.items[3].id);
  });
});
