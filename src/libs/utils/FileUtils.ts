import {PlatformUtils} from './PlatformUtils';
import * as path from 'path';
import * as fs from 'fs';


export class FileUtils {

  static _GLOB: any = null;

  static _getGlob() {
    if (!this._GLOB) {
      this._GLOB = PlatformUtils.load('glob');
    }
    return this._GLOB;
  }


  static glob(lib_path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this._getGlob()(lib_path, ((err: Error, matches: string[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(matches);
        }
      }));
    });
  }


  static async getJson(filepath: string): Promise<any> {
    try {
      const data = await this.readFile(filepath);
      return JSON.parse(data.toString('utf-8'));
    } catch (e) {
    }
    return null;
  }

  static getJsonSync(filepath: string): any {
    try {
      const data = this.readFileSync(filepath);
      return JSON.parse(data.toString('utf-8'));
    } catch (e) {
    }
    return null;
  }


  static readFile(filename: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  static readFileSync(filename: string): Buffer {
    return fs.readFileSync(filename);
  }

  static writeFileSync(filename: string, content: Buffer | string,
                       options?: { encoding?: string | null; mode?: number | string; flag?: string; } | string | null): void {
    return fs.writeFileSync(filename, content, options);
  }

  static writeFile(filename: string, content: string | Buffer,
                   options?: { encoding?: string | null; mode?: number | string; flag?: string; } | string | null): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(filename, content, options, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }


  static deleteFile(dir: string, file: string): Promise<{}> {
    return new Promise(function (resolve, reject) {
      const filePath = path.join(dir, file);
      fs.lstat(filePath, function (err, stats) {
        if (err) {
          return reject(err);
        }
        if (stats.isDirectory()) {
          resolve(PlatformUtils.deleteDirectory(filePath));
        } else {
          fs.unlink(filePath, function (err) {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        }
      });
    });
  }

}
