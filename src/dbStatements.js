export default class DBStatements {
  async compile(sql) {
    this.$addTable = await sql.prepare(`
        INSERT INTO xpl_tables VALUES(
          $moduleId,
          $patchId,
          $parentId,
          null
        );
    `);
  }
}
