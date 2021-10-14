class ErrorHandler {
  static missingData(response, dataParameter) {
    response.status(400).json({ error: `Missing ${dataParameter}` });
  }

  static parentNotFound(response) {
    response.status(400).json({ error: 'Parent not found' });
  }

  static notAFolder(response) {
    response.status(400).json({ error: 'Parent is not a folder' });
  }

  static noContent(response) {
    response.status(400).json({ error: 'A folder doesn\'t have content' });
  }

  static alreadyExist(response) {
    response.status(400).json({ error: 'Already exist' });
  }

  static unauthorizedUser(response) {
    response.status(401).json({ error: 'Unauthorized' });
  }

  static notFound(response) {
    response.status(404).json({ error: 'Not found' });
  }
}

export default ErrorHandler;
