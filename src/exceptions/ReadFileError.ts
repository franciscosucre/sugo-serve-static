export class FileReadingError extends Error {
  public status = 500;
  public code = 'FileNotFoundError';
  public name = 'FileNotFoundError';

  public toJSON() {
    return Object.assign(this, { message: this.message, stack: this.stack });
  }
}

export default FileReadingError;
