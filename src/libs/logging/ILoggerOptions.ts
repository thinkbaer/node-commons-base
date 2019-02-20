export interface ILoggerOptions {
  context: string;
  type: string;
  override?: boolean;
  level?: number;

  [k: string]: any;
}
