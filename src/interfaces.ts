export type HandlerFunction = (req: any, res: any, next?: INextFunction) => void;
export type INextFunction = () => any;
export interface IGenerateStaticFileHandlerOptions {
  basePath: string;
  baseUrl: string;
  normalize: boolean;
}
