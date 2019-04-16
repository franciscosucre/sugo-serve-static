class FileNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
    this.code = "FileNotFoundError";
    this.name = "FileNotFoundError";
  }

  toJSON() {
    const error = super.toJSON();
    return Object.assign(error, { message: this.message, stack: this.stack });
  }
}

module.exports = {
  FileNotFoundError
};
