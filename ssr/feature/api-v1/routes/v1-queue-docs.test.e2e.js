describe('v1QueueDocs', () => {
  beforeEach(global.resetSchema);

  it('should list documents', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    await global.query(`SELECT * FROM fetchq.doc_append('q1', '{ "idx": 1 }')`);
    await global.query(`SELECT * FROM fetchq.doc_append('q1', '{ "idx": 2 }')`);
    await global.query(`SELECT * FROM fetchq.mnt()`);
    const r1 = await global.get('/api/v1/queues/q1/docs');
    expect(Array.isArray(r1.data.items)).toBe(true);
    expect(r1.data.items.length).toBe(2);
    expect(r1.data.pagination.count).toBe(2);
    expect(r1.data.pagination.limit).toBe(10);
    expect(r1.data.pagination.offset).toBe(0);
    expect(r1.data.pagination.order).toBe('next_iteration');
    expect(r1.data.pagination.direction).toBe('asc');
  });

  it('should handle a non existing queue', async () => {
    const onError = jest.fn();

    try {
      await global.get('/api/v1/queues/q1/docs');
    } catch (err) {
      onError(err);
    }

    const calls = onError.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].response.status).toBe(404);
    expect(calls[0][0].response.data.success).toBe(false);
  });

  it('should handle an empty queue', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    const r1 = await global.get('/api/v1/queues/q1/docs');
    expect(r1.data.items.length).toBe(0);
    expect(r1.data.pagination.count).toBe(0);
  });

  it('should handle pagination with default sorting', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    for (let i = 0; i < 7; i++) {
      await global.query(`SELECT * FROM fetchq.doc_push('q1', 'doc-${i}')`);
    }
    await global.query(`SELECT * FROM fetchq.mnt()`);

    const r1 = await global.get('/api/v1/queues/q1/docs?limit=3');
    expect(r1.data.items.length).toBe(3);
    expect(r1.data.items[0].subject).toBe('doc-0');
    expect(r1.data.items[1].subject).toBe('doc-1');
    expect(r1.data.items[2].subject).toBe('doc-2');

    const r2 = await global.get(
      `/api/v1/queues/q1/docs?limit=3&offset=${r1.data.pagination.offset + 1}`,
    );

    expect(r2.data.items[0].subject).toBe('doc-3');
    expect(r2.data.items[1].subject).toBe('doc-4');
    expect(r2.data.items[2].subject).toBe('doc-5');

    const r3 = await global.get(
      `/api/v1/queues/q1/docs?limit=3&offset=${r2.data.pagination.offset + 1}`,
    );

    expect(r3.data.items.length).toBe(1);
    expect(r3.data.items[0].subject).toBe('doc-6');
  });
});
