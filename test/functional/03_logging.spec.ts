import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import "reflect-metadata";
import {C_INFO, ConsoleLogger, Logger} from "../../src";

const stdMocks = require('std-mocks');

@suite('test/functional/logging')
class LoggingSpec {

  @test
  async 'log'() {
    stdMocks.use();
    let logger  = Logger.getLogger();
    expect(logger).to.be.instanceOf(ConsoleLogger);
    expect(logger.getLevel().name).to.be.eq(C_INFO);
    Logger.error('test');
    Logger.log('test');
    stdMocks.restore();
    const out = stdMocks.flush();
    expect(out).to.be.deep.eq({ stdout: [ 'test\n' ], stderr: [ 'test\n' ] });
  }

}
