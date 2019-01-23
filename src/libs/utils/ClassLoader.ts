/**
 *
 * @see https://github.com/typeorm/typeorm/blob/master/src/util/DirectoryExportedClassesLoader.ts
 *
 */

import * as _ from "lodash"
import {PlatformUtils} from "./PlatformUtils";
import {StringOrFunction} from "../Constants";


const __SOURCE__ = '__SOURCE__';
/**
 * Loads all exported classes from the given directory.
 */
export class ClassLoader {

  static importClassesFromAny(o: StringOrFunction[]): Function[] {

    let klasses: Function[] = [];

    o.forEach(x => {
      if (_.isString(x)) {
        let _x = PlatformUtils.pathNormilize(PlatformUtils.pathResolve(x));
        let exported = ClassLoader.importClassesFromDirectories([_x]);
        klasses = klasses.concat.apply(klasses, exported)
      } else if (x instanceof Function) {
        klasses.push(x)
      } else {
        throw new Error('TODO: unknown ' + x)
      }
    });
    return klasses
  }

  private static filterClasses(exported: { loaded: any, source: string } | { loaded: any, source: string }[], allLoaded: Function[]) {
    if (_.isArray(exported)) {
      exported.forEach(e => this.filterClasses(e, allLoaded));
    } else {
      if (exported.loaded instanceof Function) {
        if (Reflect && Reflect['getOwnMetadata']) {
          Reflect['defineMetadata'](__SOURCE__, exported.source, exported.loaded)
        } else {
          exported.loaded.__SOURCE__ = exported.source;
        }
        allLoaded.push(exported.loaded);
      } else if (exported.loaded instanceof Object) {
        Object.keys(exported.loaded).forEach(key => this.filterClasses({
          loaded: exported.loaded[key],
          source: exported.source
        }, allLoaded));
      } else if (exported.loaded instanceof Array) {
        exported.loaded.forEach((i: any) => this.filterClasses({
          loaded: i,
          source: exported.source
        }, allLoaded));
      }
    }

    return allLoaded;
  }


  private static loadFileClasses(exported: any, allLoaded: Function[]) {
    if (exported instanceof Function) {
      allLoaded.push(exported);
    } else if (exported instanceof Object) {
      Object.keys(exported).forEach(key => this.loadFileClasses(exported[key], allLoaded));

    } else if (exported instanceof Array) {
      exported.forEach((i: any) => this.loadFileClasses(i, allLoaded));
    }

    return allLoaded;
  }

  static importClassesFromDirectories(directories: string[], formats = [".js", ".ts"]): Function[] {

    const allFiles = directories.reduce((allDirs, dir) => {
      let x = PlatformUtils.pathNormilize(dir);
      let y = PlatformUtils.load("glob").sync(x);
      return allDirs.concat(y);
    }, [] as string[]);

    const dirs: { loaded: any, source: string }[] = allFiles
      .filter(file => {
        const dtsExtension = file.substring(file.length - 5, file.length);
        return formats.indexOf(PlatformUtils.pathExtname(file)) !== -1 && dtsExtension !== ".d.ts";
      })
      .map(file => {
        let cls = {
          source: file,
          loaded: PlatformUtils.load(PlatformUtils.pathResolve(file))
        };
        return cls;
      });

    return this.filterClasses(dirs, []);//this.loadFileClasses(dirs, []);
  }


  /**
   * Loads all json files from the given directory.
   */
  static importJsonsFromDirectories(directories: string[], format = ".json"): any[] {

    const allFiles = directories.reduce((allDirs, dir) => {
      return allDirs.concat(PlatformUtils.load("glob").sync(PlatformUtils.pathNormilize(dir)));
    }, [] as string[]);

    return allFiles
      .filter(file => PlatformUtils.pathExtname(file) === format)
      .map(file => PlatformUtils.load(PlatformUtils.pathResolve(file)));
  }


  static getSource(cls: Function): string {
    let _path = null;
    if (Reflect && Reflect['getOwnMetadata']) {
      _path = Reflect['getOwnMetadata'](__SOURCE__, cls);
    } else {
      _path = cls[__SOURCE__] ? cls[__SOURCE__] : null;
    }
    return _path;
  }

  static getClassName(klass: string | Function) {
    if (_.isString(klass)) {
      return klass;
    } else if (_.isFunction(klass)) {
      return klass.name;
    } else if (_.isObject(klass)) {
      return klass.constructor.name;
    } else {
      throw new Error('class not found!');
    }
  }


  static getFunction(klass: string | Function) {
    if (_.isString(klass)) {
      // TODO create error class
      throw new Error('class not found! 02');
    } else if (_.isFunction(klass)) {
      return klass;
    } else if (_.isObject(klass)) {
      return klass.constructor;
    } else {
      // TODO create error class
      throw new Error('class not found! 01');
    }
  }

}
