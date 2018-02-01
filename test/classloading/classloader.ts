import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import {ClassLoader} from "../../src";


@suite('test/classloading')
class Classloader {

  @test
  async 'source in embedded'() {
    let clss = ClassLoader.importClassesFromDirectories([__dirname+'/classes/*'])
    expect(clss).to.have.length(1);
    let path = clss[0].__SOURCE__;
    path = path.replace(__dirname,'.');
    expect(path).to.eq('./classes/Cls01.ts');
  }
}
