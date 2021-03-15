const getQueueMetrics = async (queue) => {
  const _sqlCnt = `SELECT * FROM fetchq.metric_get('${queue}')`;
  const res = await global.query(_sqlCnt);
  return res.rows.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.metric]: Number(curr.current_value),
    }),
    {},
  );
};

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

  it('should update counters from ACTIVE status', async () => {
    await global.query(`SELECT FROM fetchq.queue_create('q1')`);
    await global.query(`SELECT FROM fetchq.queue_set_max_attempts('q1', 1)`);
    await global.query(`SELECT FROM fetchq.doc_push('q1', 's1')`);
    await global.query(`SELECT FROM fetchq.doc_pick('q1', 0, 1, '1y')`);
    await global.query(`SELECT FROM fetchq.mnt()`);

    const m1 = await getQueueMetrics('q1');
    expect(m1).toEqual({ act: 1, cnt: 1, ent: 1, pkd: 1, pnd: 0, v0: 1 });

    await global.post('/api/v1/queues/q1/play/s1');
    await global.query(`SELECT FROM fetchq.mnt()`);

    const m2 = await getQueueMetrics('q1');
    expect(m2).toEqual({ act: 0, cnt: 1, ent: 1, pkd: 1, pnd: 1, v0: 1 });
  });

  it('should update counters from PLANNED status', async () => {
    await global.query(`SELECT FROM fetchq.queue_create('q1')`);
    await global.query(`SELECT FROM fetchq.queue_set_max_attempts('q1', 1)`);
    await global.query(
      `SELECT FROM fetchq.doc_push('q1', 's1', 0, 0, NOW() + INTERVAL '1m', '{}')`,
    );
    await global.query(`SELECT FROM fetchq.mnt()`);

    const m1 = await getQueueMetrics('q1');
    expect(m1).toEqual({ cnt: 1, ent: 1, pln: 1, v0: 1 });

    await global.post('/api/v1/queues/q1/play/s1');
    await global.query(`SELECT FROM fetchq.mnt()`);

    const m2 = await getQueueMetrics('q1');
    expect(m2).toEqual({ cnt: 1, ent: 1, pln: 0, pnd: 1, v0: 1 });
  });
});
