import {ILogLevel} from "./ILogLevel";

export interface ILoggerApi {

  isEnabled(set?:boolean):boolean;

  log(level: number | string, ...msg: any[]): void;

  info(...msg: any[]): void;

  warn(...msg: any[]): void;

  error(...msg: any[]): void;

  debug(...msg: any[]): void;

  trace(...msg: any[]): void;

  getLevel(): ILogLevel;

  setLevel(level:number | string): void;

}
