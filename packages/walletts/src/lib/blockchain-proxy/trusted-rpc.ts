import { Client } from 'bitcoin-core';
import { Transaction } from 'bitcoinjs-lib';
import * as fs from 'fs';
import * as ini from 'ini';
import logger from '../logger';
import { BlockchainProxy } from './index';
import * as Logger from 'bunyan';

export class TustedBitcoindRPC implements BlockchainProxy {
  public readonly client: any;
  public readonly logger: Logger;
  constructor(confPath: fs.PathLike, log: Logger) {
    this.logger = log.child({ subModule: 'TrustedBitcoindRPC' });
    this.logger.debug(
      `going to use testnet bitcoin-core specified in ${confPath}`
    );
    const conf = ini.parse(fs.readFileSync(confPath, 'utf-8'));
    const opts = {
      username: conf.rpcuser,
      password: conf.rpcpassword,
      host: conf.rpcconnect,
      network: conf.testnet ? 'testnet' : 'mainnet'
    };
    this.client = new Client(opts);
  }

  public async getPrevHash(tx: Transaction): Promise<ReadonlyArray<string>> {
    this.logger.debug(`tx is ${JSON.stringify(tx.toHex())}`);
    this.logger.debug(`client is ${JSON.stringify(this.client)}`);
    this.logger.debug(`tx id is ${tx.getId()}`);
    const RawTx: string = await this.client.getRawTransaction(tx.getId());
    this.logger.debug(`Raw TX is ${RawTx}`);
    const txwithInfo: any = await this.client.decodeRawTransaction(RawTx);
    this.logger.debug(`tx withInfo is ${JSON.stringify(txwithInfo)} `);

    // using Array.map() will cause bizarre error. So for loop instead.
    const promises: any[] = [];
    for (const i of txwithInfo.vin) {
      const promise = this.client.getRawTransaction(i.txid);
      promises.push(promise);
    }
    const prevTxRaw = await Promise.all(promises);

    return prevTxRaw
      .map((rtx: string) => Transaction.fromHex(rtx))
      .map((t: Transaction) => t.getId());
  }
  public async isConnected(): Promise<void> {
    if (this.client.ping) {
      this.logger.error('not implemented !');
    }
  }
}
