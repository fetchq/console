describe('v1QueueDocuments', () => {
  beforeEach(global.resetSchema);

  it('should list documents', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    await global.query(`SELECT * FROM fetchq.doc_append('q1', '{}')`);
    await global.query(`SELECT * FROM fetchq.mnt()`);
    const r1 = await global.get('/api/v1/queues/q1/documents');
    expect(Array.isArray(r1.data.items)).toBe(true);
    expect(r1.data.items.length).toBe(1);
  });

  it('should handle a non existing queue', async () => {
    const onError = jest.fn();

    try {
      await global.get('/api/v1/queues/q1/documents');
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
    const r1 = await global.get('/api/v1/queues/q1/documents');
    expect(r1.data.items.length).toBe(0);
    expect(r1.data.pages.pagesCount).toBe(0);
    expect(r1.data.pages.itemsCount).toBe(0);
  });

  it('should handle pagination', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    for (let i = 0; i < 7; i++) {
      await global.query(
        `SELECT * FROM fetchq.doc_append('q1', '{"idx": ${i}}')`,
      );
    }
    await global.query(`SELECT * FROM fetchq.mnt()`);

    const r1 = await global.get('/api/v1/queues/q1/documents?limit=3');
    expect(r1.data.items.length).toBe(3);
    expect(r1.data.pages.cursorStart).toBe(r1.data.items[0].created_at);
    expect(r1.data.pages.cursorEnd).toBe(r1.data.items[2].created_at);
    expect(r1.data.pages.hasNext).toBe(true);
    expect(r1.data.items[0].payload.idx).toBe(6);
    expect(r1.data.items[1].payload.idx).toBe(5);
    expect(r1.data.items[2].payload.idx).toBe(4);

    const r2 = await global.get(
      `/api/v1/queues/q1/documents?limit=3&cursor=${r1.data.pages.cursorEnd}`,
    );

    expect(r2.data.pages.hasNext).toBe(true);
    expect(r2.data.items[0].payload.idx).toBe(3);
    expect(r2.data.items[1].payload.idx).toBe(2);
    expect(r2.data.items[2].payload.idx).toBe(1);

    const r3 = await global.get(
      `/api/v1/queues/q1/documents?limit=3&cursor=${r2.data.pages.cursorEnd}`,
    );

    expect(r3.data.items.length).toBe(1);
    expect(r3.data.pages.hasNext).toBe(false);
  });

  // in case queue is empty

  // in case of too many documents

  // it('should load a queue details', async () => {
  //   await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
  //   await global.query(`SELECT * FROM fetchq.doc_append('q1', '{}')`);
  //   await global.query(`SELECT * FROM fetchq.mnt()`);
  //   const r1 = await global.get('/api/v1/queues/q1');
  //   expect(r1.data.queue.name).toBe('q1');
  //   expect(r1.data.metrics.find(getMetric('cnt')).current_value).toBe(1);
  // });
});
