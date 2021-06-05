describe('v1DocumentCreate', () => {
  beforeEach(global.resetSchema);

  it('should create a new document with a custom subject', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    const r1 = await global.post(`/api/v1/queues/q1/docs`, { subject: 'd1' });
    expect(r1.data.op).toBe('push');
    expect(r1.data.doc.subject).toBe('d1');
  });

  it('should create a new document without subject (append mode)', async () => {
    await global.query(`SELECT * FROM fetchq.queue_create('q1')`);
    const r1 = await global.post(`/api/v1/queues/q1/docs`, {});
    console.log(r1.data);
  });
});