# d-im-sandbox

## Dep
1. TiKV https://tikv.org/docs/6.1/concepts/tikv-in-5-minutes/
2. SurrealDB https://surrealdb.com/install

## Notes
A sample sandbox to demostrate the idea of a decentralized IM application. 

This sandbox is: 
1. ofc, not for production. 
2. centralized deployed.
3. with no encryption 

## How to run

1. Start TiKV `tiup playground --tag surrealdb --mode tikv-slim --pd 1 --kv 1`
2. Start SurrealDB `surreal start --log trace --user root --pass root tikv://127.0.0.1:2379`
3. Start client 1 `./node_modules/.bin/ts-node ./src/runner/main alice bob`
4. Start client 2 `./node_modules/.bin/ts-node ./src/runner/main bob alice`

## License

The entire code within this repository is licensed under the [GPLv3](LICENSE).

Please [contact us](https://skye.kiwi) if you have questions about
the licensing of our products.
