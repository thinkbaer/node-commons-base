import * as _ from 'lodash';
import {ILoggerApi} from "./ILoggerApi";
import {ConsoleLogger} from "./ConsoleLogger";
import {C_CONSOLE, C_DEBUG, C_DEFAULT, C_ERROR, C_INFO, C_TRACE, C_WARN} from "../Constants";
import {ILoggerOptions} from "./ILoggerOptions";


const DEFAULT: ILoggerOptions = {
  context: C_DEFAULT,
  type: C_CONSOLE

}

export class Logger {

  private static _self: Logger;

  private loggerTypes: { [k: string]: Function } = {
    console: ConsoleLogger
  }

  private instances: { [key: string]: ILoggerApi } = {};

  private constructor() {

  }

  getInstances() {
    return this.instances;
  }

  getTypes() {
    return this.loggerTypes;
  }

  static $() {
    if (!this._self) {
      this._self = new Logger()
    }
    return this._self;
  }

  static addType(type: string, cls: Function) {
    this.$().loggerTypes[type] = cls;
  }

  static getLogger(opts: ILoggerOptions = DEFAULT) {
    if (!this.$().instances[opts.context] || _.get(opts, 'override', false)) {
      const type = this.$().loggerTypes[opts.type];
      if (type) {
        this.$().instances[opts.context] = Reflect.construct(type, [opts]);
      } else {
        this.$().instances[opts.context] = Reflect.construct(ConsoleLogger, [opts]);
      }

    }
    return this.$().instances[opts.context];
  }


  static log(level: number | string = C_INFO, ...msg: any[]) {
    this.getLogger().log(level, ...msg);
  }

  static error(...msg: any[]) {
    this.log(C_ERROR, ...msg);
  }

  static warn(...msg: any[]) {
    this.log(C_WARN, ...msg);
  }

  static info(...msg: any[]) {
    this.log(C_INFO, ...msg);
  }

  static debug(...msg: any[]) {
    this.log(C_DEBUG, ...msg);
  }

  static trace(...msg: any[]) {
    this.log(C_TRACE, ...msg);
  }

}
