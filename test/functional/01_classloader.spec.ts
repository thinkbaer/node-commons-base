import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import {ClassLoader} from "../../src";


@suite('test/classloading')
class classloaderSpec {

  @test
  async 'source in embedded'() {
    let tmp = null;
    if(Reflect && Reflect['getOwnMetadata']){
      tmp = Reflect['getOwnMetadata'];
      Reflect['getOwnMetadata'] = null;
    }
    let clss = ClassLoader.importClassesFromDirectories([__dirname+'/classes/*']);
    expect(clss).to.have.length(1);
    let path = clss[0]['__SOURCE__'];
    path = path.replace(__dirname,'.');
    expect(path).to.eq('./classes/Cls01.ts');

    if(tmp){
      Reflect['getOwnMetadata'] = tmp;
    }
  }
}
