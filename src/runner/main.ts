import { u8aToHex, sleep } from '@skyekiwi/util'
import { randomBytes } from 'tweetnacl';
import { DB } from "../util";


const spamMsg = async (from: string, to: string, db: DB) => {
  const loop = 1000;

  for (let l = 0; l < loop; l ++) {
    let query = "";

    // a loop that push random chat msg to db
    for (let i = 0; i < 5; i ++) {
      const message = u8aToHex(randomBytes(32));
      query += db.insertMessage({
        from: from, to: to, message: message,
      })
      console.log(`WRITE ${from} ${to}: ${message}`)
      await sleep(1000);
    }
    await db.commit(query);
    await sleep(2000);
  }
}

const readMsg = async (from: string, to: string, db: DB) => {
  const msgs = await db.selectUnreadMessage(from, to);
  
  // is a messaage is read - change it to be "read"
  let query = "";
  for (const msg of msgs) {
    query += db.updateMessageStatus(msg.id);
    console.log(`READ ${msg.from} ${msg.to}: ${msg.message} WITH ID ${msg.id}`)
  }
  await db.commit(query);
}

const main = async () => {
  const from = process.argv[2];
  const to = process.argv[3];

  const db = new DB();
  await db.init();

  // No await - let it run
  void spamMsg(from, to, db);

  while(true) {
    await readMsg(from, to, db);
    await sleep(2000)
  }
}
  
main();