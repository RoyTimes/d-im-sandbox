import Surreal from 'surrealdb.js';
import bridgeConfig from '../config';
import { Message, MessageWithId } from '../types';

export class DB {

  #db: Surreal;
  isInit: boolean

  constructor() {
    this.#db = new Surreal(bridgeConfig.surrealDBEndpoint);
  }

  public isReady(): boolean {
    return this.isInit;
  }
  public async init() {
    await this.#db.signin({ user: 'root', pass: 'root', });
    await this.#db.use('d-im', 'data');
    this.isInit = true;
    // maybe init metadata
  }

  public async modify(sql: string) {
    return await this.#db.query(sql);
  }

  public async query(sql: string) {
    const res = await this.#db.query(sql);
    return res[0].result;
  }

  public insertMessage(message: Message) {
    return `
      CREATE messages SET \
        from = "${message.from}", \
        to = "${message.to}", \
        message = "${message.message}", \
        status = "recorded";
    `;
  }

  public updateMessageStatus(id: string) {
    return `
      UPDATE ${id} SET status = "read";
    `
  }

  public async selectUnreadMessage(party1: string, party2: string): Promise<MessageWithId[]> {
    const res = (await this.query(`
    SELECT from, to, message, id FROM messages WHERE \
      (
        (from = "${party1}" AND to = "${party2}") OR \
        (from = "${party2}" AND to = "${party1}") \
      ) AND status = "recorded"
    `)) as MessageWithId[];
    return res;
  }

  // MISC
  public async commit(query: string) {
    const blockQuery = `
      BEGIN TRANSACTION; \
      ${query}
      COMMIT TRANSACTION;
    `;


    const res = await this.modify(blockQuery);
    for (const r of res) {
      // @ts-ignore
      if (r.status !== "OK") {
        console.error(r);
      }
    }
  }
}
