export class FileNotFoundError extends Error {
  public status = 404;
  public code = 'FileNotFoundError';
  public name = 'FileNotFoundError';

  public toJSON() {
    return Object.assign(this, { message: this.message, stack: this.stack });
  }
}
