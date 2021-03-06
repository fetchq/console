describe('v1DocumentDetails', () => {
  beforeEach(global.resetSchema);

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

  it('should throw error in case the document does not exists', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    const onError = jest.fn();
    try {
      await global.get('/api/v1/queues/q1/docs/foobar');
    } catch (err) {
      onError(err);
    }
    expect(onError.mock.calls.length).toBe(1);
    expect(onError.mock.calls[0][0].response.status).toBe(404);
    expect(onError.mock.calls[0][0].response.data.success).toBe(false);
  });

  it('should load a document details', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    const doc = await global.query(
      `SELECT * FROM fetchq.doc_append('q1', '{}')`,
    );
    const r1 = await global.get(
      `/api/v1/queues/q1/docs/${doc.rows[0].subject}`,
    );
    expect(r1.data.doc.subject).toBe(doc.rows[0].subject);
    expect(r1.data.prevDoc).toBe(null);
    expect(r1.data.nextDoc).toBe(null);
  });

  it('should load a document details', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    const prevDoc = await global.query(
      `SELECT * FROM fetchq.doc_append('q1', '{}')`,
    );
    const doc = await global.query(
      `SELECT * FROM fetchq.doc_append('q1', '{}')`,
    );
    const nextDoc = await global.query(
      `SELECT * FROM fetchq.doc_append('q1', '{}')`,
    );
    const r1 = await global.get(
      `/api/v1/queues/q1/docs/${doc.rows[0].subject}`,
    );
    expect(r1.data.doc.subject).toBe(doc.rows[0].subject);
    expect(r1.data.prevDoc).toBe(prevDoc.rows[0].subject);
    expect(r1.data.nextDoc).toBe(nextDoc.rows[0].subject);
  });
});
