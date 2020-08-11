/**
 * see https://github.com/typeorm/typeorm/blob/master/src/platform/PlatformTools.ts
 */


import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import {FileUtils} from './FileUtils';


const FILEPATH = path.sep === '/' ? /^(\.|\.\/|\/)([\w\/\.\-_ ]*)$/ : /^(?:[a-zA-Z]\:|\\\\[\w\.]+\\[\w.$]+)\\(?:[\w]+\\)*\w([\w.])+$/;

/**
 * Platform-specific tools.
 */
export class PlatformUtils {

  /**
   * Type of the currently running platform.
   */
  static type: 'browser' | 'node' = 'node';

  static workdir: string = null;

  /**
   * Gets global variable where global stuff can be stored.
   */
  static getGlobalVariable(): any {
    return global;
  }


  /**
   * set workdir
   */
  static setWorkDir(workdir: string) {
    if (_.isString(workdir)) {
      this.workdir = PlatformUtils.pathResolve(workdir);
    } else {
      this.workdir = null;
    }
  }


  static join(...args: string[]) {
    return path.join(...args);
  }

  /**
   * Loads ("require"-s) given file or package.
   * This operation only supports on node platform
   */
  static load(name: string): any {

    // if name is not absolute or relative, then try to load package from the node_modules of the directory we are currenly in
    // this is useful when we are using typeorm package globally installed and it accesses drivers
    // that are not installed globally

    try {
      if (this.fileExist(name)) {
        const ext = this.pathExtname(name);
        if (ext) {
          // name without ext
          name = name.replace(ext, '');
        }
      }
      return require(name);
    } catch (err) {
      if (!path.isAbsolute(name) && name.substr(0, 2) !== './' && name.substr(0, 3) !== '../') {
        return require(path.resolve(process.cwd() + '/node_modules/' + name));
      }

      throw err;
    }
  }

  /**
   * Normalizes given path. Does "path.normalize".
   */
  static pathNormilize(pathStr: string): string {
    return path.normalize(pathStr);
  }

  /**
   * Gets file extension. Does "path.extname".
   */
  static pathExtname(pathStr: string, dotted: boolean = true): string {
    let str = '';
    if (/\$\{.*\}/.test(pathStr)) {
      str = this.withoutInterpolation(pathStr, (str) => {
        return path.extname(str);
      });
    } else {
      str = path.extname(pathStr);
    }
    if (!dotted) {
      str = str.replace('.', '');
    }
    return str;
  }

  /**
   * Resolved given path. Does "path.resolve".
   */
  static pathResolve(pathStr: string): string {
    if (this.workdir) {
      return path.resolve(this.workdir, pathStr);
    }
    return path.resolve(pathStr);
  }

  /**
   * Resolved given path. Does "path.resolve".
   */
  static pathNormAndResolve(pathStr: string): string {
    return this.pathNormilize(this.pathResolve(pathStr));
  }

  static isFile(pathStr: string): boolean {
    return fs.statSync(pathStr).isFile();
  }

  static isDir(pathStr: string): boolean {
    return fs.statSync(pathStr).isDirectory();
  }

  /**
   * Synchronously checks if file exist. Does "fs.existsSync".
   */
  static fileExist(pathStr: string): boolean {
    return fs.existsSync(pathStr);
  }

  /**
   * Returns the basename of a file
   */
  static basename(pathStr: string): string {
    return path.basename(pathStr);
  }

  static withoutInterpolation(str: string, fn: (str: string) => string) {
    if (/\$\{.*\}/.test(str)) {
      // has interpolations
      const regex = new RegExp(/\$\{.*\}/g);
      const m = regex.exec(str);
      const cache = {};
      let inc = 0;
      for (const _m of m) {
        const r = '###' + (inc++) + '###';
        str = str.replace(_m, r);
        cache[r] = _m;
      }
      str = fn(str);
      for (const _m in cache) {
        str = str.replace(_m, cache[_m]);
      }
    }
    return str;
  }

  /**
   * Returns the filename only (without extension)
   */
  static filename(pathStr: string): string {
    const base = path.basename(pathStr);
    if (/\$\{.*\}/.test(base)) {
      return this.withoutInterpolation(base, (str) => {
        return str.replace(new RegExp('\\' + path.extname(str) + '$'), '');
      });
    }
    return base.replace(new RegExp('\\' + path.extname(base) + '$'), '');
  }


  /**
   * Returns the dirname of the file
   */
  static dirname(pathStr: string): string {
    return path.dirname(pathStr);
  }


  static testForFilePath(path: string) {
    return FILEPATH.test(path);
  }

  /**
   * Normalizes given path. Does "path.normalize".
   */
  static pathNormalize(pathStr: string): string {
    return path.normalize(pathStr);
  }

  /**
   * Normalizes given path. Does "path.normalize".
   */
  static pathResolveAndNormalize(pathStr: string): string {
    return this.pathNormalize(this.pathResolve(pathStr));
  }


  /**
   * Test if path is absolute.
   */
  static isAbsolute(pathStr: string): boolean {
    return path.isAbsolute(pathStr);
  }

  static directory(file: string): string {
    return path.dirname(file);
  }


  /**
   * Gets environment variable.
   */
  static getEnvVariable(name: string): any {
    return process.env[name];
  }


  static getHostPath(): string {
    if (process.platform === 'win32') {
      return path.join(process.env.SYSTEMROOT, '/System32/drivers/etc/hosts');
    }
    return '/etc/hosts';
  }

  static getHostFileContent(): string {
    return fs.readFileSync(this.getHostPath(), {encoding: 'utf-8'});
  }

  static mkdir(targetDir: string, sep: string = path.sep): boolean {
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(parentDir, childDir);
      if (!fs.existsSync(curDir)) {
        fs.mkdirSync(curDir);
      }
      return curDir;
    }, initDir);
    return true;
  }


  static readFile(filename: string): Promise<Buffer> {
    return FileUtils.readFile(filename);
  }

  static readFileSync(filename: string): Buffer {
    return FileUtils.readFileSync(filename);
  }

  static deleteFile(dir: string, file: string): Promise<{}> {
    return FileUtils.deleteFile(dir, file);
  }

  static deleteDirectory(dir: string): Promise<{}> {
    return new Promise(function (resolve, reject) {
      fs.access(dir, function (err) {
        if (err) {
          return reject(err);
        }
        fs.readdir(dir, function (err, files) {
          if (err) {
            return reject(err);
          }
          Promise.all(files.map(function (file) {
            return PlatformUtils.deleteFile(dir, file);
          })).then(function () {
            fs.rmdir(dir, function (err) {
              if (err) {
                return reject(err);
              }
              resolve();
            });
          }).catch(reject);
        });
      });
    });
  }


}
