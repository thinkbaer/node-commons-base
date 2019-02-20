import {ILogLevel} from "./ILogLevel";

export interface ILoggerApi {

  log(level: number | string, msg: string,): void;

  info(msg: string): void;

  warn(msg: string): void;

  error(msg: string): void;

  debug(msg: string): void;

  trace(msg: string): void;

  getLevel(): ILogLevel;

}
