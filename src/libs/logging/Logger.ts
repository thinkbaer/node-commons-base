import * as _ from 'lodash';
import {ILoggerApi} from "./ILoggerApi";
import {ConsoleLogger} from "./ConsoleLogger";
import {C_CONSOLE, C_DEFAULT} from "../Constants";
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


  static log(msg: string, level: number | string = 'info', opts: ILoggerOptions = DEFAULT) {
    this.getLogger(opts).log(level, msg);
  }


}
