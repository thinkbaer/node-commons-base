import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import "reflect-metadata";
import {ClassLoader} from "../../src";


@suite('test/classloading/reflect')
class Classloader {

  @test
  async 'source in metadata'() {
    let clss = ClassLoader.importClassesFromDirectories([__dirname+'/classes/*'])
    expect(clss).to.have.length(1);
    let path = Reflect.getOwnMetadata('__SOURCE__',clss[0]);
    path = path.replace(__dirname,'.');
    expect(path).to.eq('./classes/Cls01.ts');
  }


  @test
  async 'load from any'() {
    let clss = ClassLoader.importClassesFromAny([__dirname+'/classes/Cls01.ts']);
    expect(clss).to.have.length(1);
    let path = Reflect.getOwnMetadata('__SOURCE__',clss[0]);
    path = path.replace(__dirname,'.');
    expect(path).to.eq('./classes/Cls01.ts');

  }
}
