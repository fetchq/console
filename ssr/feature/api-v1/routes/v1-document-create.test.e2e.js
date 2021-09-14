describe('v1DocumentCreate', () => {
  beforeEach(global.reset);

  describe('push', () => {
    it('should create a new document with a custom subject', async () => {
      await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);
      const r1 = await global.post(`/api/v1/queues/q1/docs`, { subject: 'd1' });
      expect(r1.data.op).toBe('push');
      expect(r1.data.doc.subject).toBe('d1');
    });

    it('should create a new document with a custom payload', async () => {
      await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);

      const r1 = await global.post(`/api/v1/queues/q1/docs`, {
        subject: 'd1',
        payload: { a: 1 },
      });

      expect(r1.data.op).toBe('push');
      expect(r1.data.doc.subject).toBe('d1');
      expect(r1.data.doc.payload.a).toBe(1);
    });
  });

  describe('append', () => {
    it('should create a new document without subject (append mode)', async () => {
      await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);
      const r1 = await global.post(`/api/v1/queues/q1/docs`, {});
      expect(r1.data.doc.status).toBe(1);
    });

    it('should append a new document with a payload', async () => {
      await global.fetchq.query(`SELECT * FROM fetchq.queue_create('q1')`);
      const r1 = await global.post(`/api/v1/queues/q1/docs`, {
        payload: { a: 1 },
      });

      expect(r1.data.doc.status).toBe(1);
      expect(r1.data.doc.payload.a).toBe(1);
    });
  });
});
