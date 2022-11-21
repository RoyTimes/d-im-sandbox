import { execSync } from 'child_process';
import path from 'path';

const main = async() => {

  const pm2Path = path.join(__dirname, "../node_modules/.bin/pm2");
  const tsNodePath = path.join(__dirname, "../node_modules/.bin/ts-node");
  const runnerPath = path.join(__dirname, "./runner");

  // Launch TiKV
  execSync( `${pm2Path} start "tiup playground --tag surrealdb --mode tikv-slim --pd 1 --kv 1"` );

  // Launch DB
  execSync( `${pm2Path} start "surreal start --log trace --user root --pass root tikv://127.0.0.1:2379"` );

  console.log(` Database loaded. Now you can launch some clients. `)
  
  console.log(`RUN ${tsNodePath} ${runnerPath}/main alice bob`);
  console.log(`RUN ${tsNodePath} ${runnerPath}/main bob alice`);
}

main();

