export class FileNotFoundError extends Error {
  public name = 'FileNotFoundError';
  public status = 404;
  public path: string;
  public message = 'The requested file at path ';

  constructor(path: string) {
    super(`The requested file at path "${path}" was not found`);
    this.path = path;
    this.message = `The requested file at path "${path}" was not found`;
  }
}
