const create = async (query) => {
  // await destroy(query);
  await query(`
    CREATE TABLE IF NOT EXISTS "fetchq"."console_functions" (
      "queue" VARCHAR(255) NOT NULL,
      "type" VARCHAR(10) NOT NULL DEFAULT 'nodejs',
      "status" SMALLINT NOT NULL DEFAULT 1,
      "options" JSONB DEFAULT '{}',
      "source" TEXT DEFAULT '',
      PRIMARY KEY("queue")
    );
  `);

  // INSERT INTO "fetchq"."console_functions"
  // ("queue", "source")
  // VALUES
  // ('arrogant_eel', 'console.log(doc.subject);return doc.reschedule("+1d");');

  // Upsert trigger to keep the workers in sync:
  try {
    await query(`
      CREATE TRIGGER "fetchq_trigger_console_functions" AFTER INSERT OR UPDATE OR DELETE
      ON "fetchq"."console_functions"
      FOR EACH ROW EXECUTE PROCEDURE "fetchq"."trigger_notify_as_json"();
    `);
  } catch (err) {
    console.log('[fetchq functions v1] trigger may exists');
  }
};
const destroy = async (query) => {
  await query(`
    DROP TABLE IF EXISTS "fetchq"."console_functions" CASCADE;
  `);
};

module.exports = { create, destroy };
