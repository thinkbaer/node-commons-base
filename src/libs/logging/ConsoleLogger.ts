import {AbstractLogger} from "./AbstractLogger";
import {C_ERROR, C_TRACE, C_WARN} from "../Constants";


export class ConsoleLogger extends AbstractLogger {

  log(level: number | string, ...msg: any[]): void {
    if (!this._enable) {
      return;
    }
    const l = this.findLevel(level);
    const ll = this.getLevel();

    if (l && l.nr <= ll.nr) {
      if (l.name == C_ERROR) {
        console.error(...msg);
      } else if (l.name == C_WARN) {
        console.warn(...msg);
      } else if (l.name == C_TRACE) {
        console.trace(...msg);
      } else {
        console.log(...msg);
      }
    }
  }

}
