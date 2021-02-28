describe('Hello World', () => {
  beforeEach(global.resetSchema);

  it.skip('Should make a query to PostgreSQL', async () => {
    const r = await global.query('SELECT NOW() AS time');
    console.log(`PostgreSQL says: ${r.rows[0].time}`);
  });
});
