import * as Cycle from '@cycle/run';
import test from 'ava';
import xs, { MemoryStream, Stream } from 'xstream';
import { BitcoindRPCRequest, makeTrustedBitcoindDriver } from './';

interface Sources {
  readonly Blockchain: MemoryStream<BitcoindRPCRequest>;
}

interface Sinks {
  readonly Blockchain: Stream<any>;
}
const sleep = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec));

test('ping', async t => {
  t.plan(1);
  const main = (_: Sources): Sinks => {
    return {
      Blockchain: xs.of({ method: 'ping' })
    };
  };
  /* tslint:disable-next-line:no-expression-statement */
  const driver = makeTrustedBitcoindDriver({
    username: 'foo',
    password: 'bar',
    port: 18332
  });
  const { run, sources } = Cycle.setup(main, { Blockchain: driver });

  sources.Blockchain.addListener({
    next: _ => t.true(true, 'ping successed'),
    /* tslint:disable-next-line */
    error: e => t.log(e),
    complete: () => t.log('blockchain driver has completed')
  });

  run();
  await sleep(200);
});

test.skip('handle error when failed to connect', t => {
  t.plan(1);
  const main = (_: Sources): Sinks => {
    return {
      Blockchain: xs.of({ method: 'ping' })
    };
  };

  const driver = makeTrustedBitcoindDriver({
    username: 'wrongUserName',
    password: 'wrongPassword',
    port: 18332
  });

  const { run } = Cycle.setup(main, { Blockchain: driver });
  run();
});
