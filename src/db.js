import SQL from  "#SQL";

export default class DB {
  constructor() {
    this.sql = new SQL();
  }

  addTable(batch, data) {
    console.log(batch, data);
  }
}
