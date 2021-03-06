import * as _ from 'lodash';
import {ILoggerApi} from "./ILoggerApi";
import {ILogLevel} from "./ILogLevel";
import {C_DEBUG, C_ERROR, C_INFO, C_TRACE, C_WARN} from "../Constants";
import {ILoggerOptions} from "./ILoggerOptions";


export abstract class AbstractLogger implements ILoggerApi {

  private levelInc = 0;

  protected levels: ILogLevel[] = [];

  protected logLevel: number = 0;

  protected _enable: boolean = true;

  protected options: ILoggerOptions;


  constructor(opts: ILoggerOptions) {
    this.options = opts;
    this.addLevel(C_ERROR);
    this.addLevel(C_WARN);
    this.addLevel(C_INFO);
    this.addLevel(C_DEBUG);
    this.addLevel(C_TRACE);


    if (opts.level) {
      this.logLevel = this.findLevel(opts.level).nr;
    } else {
      this.logLevel = this.findLevel(C_INFO).nr;
    }

  }

  isEnabled(set: boolean = null): boolean {
    if (!_.isNull(set)) {
      this._enable = set;
    }
    return this._enable;
  }

  disable() {
    this._enable = false;
  }

  enable() {
    this._enable = true;
  }

  findLevel(m: string | number) {
    return this.levels.find(x => _.isNumber(m) ? x.nr == m : x.name.toLowerCase() == m.toLowerCase())
  }

  addLevel(name: string) {
    this.levels.push({nr: this.levelInc++, name: name.toLowerCase()});
  }


  getLevel(): ILogLevel {
    return _.find(this.levels, l => l.nr == this.logLevel);
  }

  setLevel(level: number | string): void {
    const l = this.findLevel(level);
    if (l) {
      this.logLevel = l.nr;
    } else {
      throw new Error("can't find given log level entry " + level)
    }
  }

  debug(...msg: any[]): void {
    this.log(C_DEBUG, ...msg);
  }


  error(...msg: any[]): void {
    this.log(C_ERROR, ...msg);
  }


  info(...msg: any[]): void {
    this.log(C_INFO, ...msg);
  }


  abstract log(level: number | string, ...msg: any[]): void ;


  trace(...msg: any[]): void {
    this.log(C_TRACE, ...msg);
  }


  warn(...msg: any[]): void {
    this.log(C_WARN, ...msg);
  }


}
