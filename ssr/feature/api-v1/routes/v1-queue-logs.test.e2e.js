describe('v1QueueLogs', () => {
  beforeEach(global.reset);

  const rejectDoc = async (queue, msg, details, refId) => {
    const res = await global.fetchq.query(
      `SELECT * FROM fetchq.doc_pick('q1', 0, 1, '1ms')`,
    );
    await global.fetchq.query(
      `SELECT * FROM fetchq.doc_reject('${queue}', '${
        res.rows[0].subject
      }', '${msg}', '${JSON.stringify(details)}', '${refId}')`,
    );
    await global.pause(1);
    await global.fetchq.query(`SELECT * FROM fetchq.mnt()`);
  };

  it('should list existing logs', async () => {
    await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);
    await global.fetchq.query(
      `SELECT * FROM fetchq.doc_append('q1', '{ "idx": 1 }')`,
    );
    await global.fetchq.query(
      `SELECT * FROM fetchq.doc_append('q1', '{ "idx": 2 }')`,
    );

    await rejectDoc('q1', 'failed', { idx: 1 }, 'a1');
    await rejectDoc('q1', 'failed', { idx: 2 }, 'a2');
    await rejectDoc('q1', 'failed', { idx: 3 }, 'a3');

    const r1 = await global.get('/api/v1/queues/q1/logs');
    expect(Array.isArray(r1.data.items)).toBe(true);
    expect(r1.data.items.length).toBe(3);
    expect(r1.data.items[0].ref_id).toBe('a3');
    expect(r1.data.items[1].ref_id).toBe('a2');
    expect(r1.data.pagination.count).toBe(3);
    expect(r1.data.pagination.limit).toBe(10);
    expect(r1.data.pagination.offset).toBe(0);
    expect(r1.data.pagination.order).toBe('id');
    expect(r1.data.pagination.direction).toBe('desc');
  });

  it('should handle a non existing queue', async () => {
    const onError = jest.fn();

    try {
      await global.get('/api/v1/queues/q1/logs');
    } catch (err) {
      onError(err);
    }

    const calls = onError.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].response.status).toBe(404);
    expect(calls[0][0].response.data.success).toBe(false);
  });

  it('should handle an empty logs table', async () => {
    await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);
    const r1 = await global.get('/api/v1/queues/q1/logs');
    expect(r1.data.items.length).toBe(0);
    expect(r1.data.pagination.count).toBe(0);
  });

  it('should handle pagination', async () => {
    await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);
    await global.fetchq.query(
      `SELECT * FROM fetchq.doc_append('q1', '{ "idx": 1 }')`,
    );
    await global.fetchq.query(
      `SELECT * FROM fetchq.doc_append('q1', '{ "idx": 2 }')`,
    );
    for (let i = 0; i < 7; i++) {
      await rejectDoc('q1', 'failed', { idx: i }, `a${i}`);
    }
    await global.fetchq.query(`SELECT * FROM fetchq.mnt()`);

    const r1 = await global.get('/api/v1/queues/q1/logs?limit=3');
    expect(r1.data.items.length).toBe(3);
    expect(r1.data.items[0].ref_id).toBe('a6');
    expect(r1.data.items[1].ref_id).toBe('a5');
    expect(r1.data.items[2].ref_id).toBe('a4');

    const r2 = await global.get(
      `/api/v1/queues/q1/logs?limit=3&offset=${r1.data.pagination.offset + 1}`,
    );

    expect(r2.data.items[0].ref_id).toBe('a3');
    expect(r2.data.items[1].ref_id).toBe('a2');
    expect(r2.data.items[2].ref_id).toBe('a1');

    const r3 = await global.get(
      `/api/v1/queues/q1/logs?limit=3&offset=${r2.data.pagination.offset + 1}`,
    );

    expect(r3.data.items.length).toBe(1);
    expect(r3.data.items[0].ref_id).toBe('a0');
  });

  it('should accept a filter on the subject', async () => {
    await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);
    const r1 = await global.fetchq.query(
      `SELECT * FROM fetchq.doc_append('q1', '{ "idx": 1 }')`,
    );
    const r2 = await global.fetchq.query(
      `SELECT * FROM fetchq.doc_append('q1', '{ "idx": 2 }')`,
    );
    await global.fetchq.query(
      `SELECT FROM fetchq.log_error('q1', '${r1.rows[0].subject}', 'err1', '{}')`,
    );
    await global.fetchq.query(
      `SELECT FROM fetchq.log_error('q1', '${r2.rows[0].subject}', 'err2', '{}')`,
    );

    const r3 = await global.get(
      `/api/v1/queues/q1/logs?subject=${r1.rows[0].subject}`,
    );

    expect(r3.data.items.length).toBe(1);
    expect(r3.data.pagination.count).toBe(1);
  });

  // Should test that the pagination holds on when data is dropped by the logs
  // due to the weak calculations of the amount of documents in the table
});
