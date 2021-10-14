import { ObjectId } from 'mongodb';
import { promises, constants } from 'fs';
import dbClient from './db';

class File {
  /**
   * Creates a directory
   * @return {Promise} Fulfills with a string containing the filesystem path of the directory
   */
  static async createDirectory(dirpath) {
    let promise = '';
    try {
      promise = promises.mkdir(dirpath, { recursive: true });
    } catch (err) {
      if (err !== 'EEXIST') throw err;
    }
    return promise;
  }

  /**
   * Checks if a file exists and tests a user's permissions for the file
   * @return {Promise} Fulfills with true | false
   */
  static async fileExists(localPath) {
    try {
      await promises.access(localPath, constants.R_OK || constants.W_OK);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Converts data to 'base64' buffer and writes it to a file
   * @return {Promise} Fulfills with undefined upon success
   */
  static async createFile(filename, data) {
    const clearData = Buffer.from(data, 'base64');
    try {
      const promise = promises.writeFile(filename, clearData);
      return promise;
    } catch (err) {
      throw Error('Cannot create the file:', err);
    }
  }

  /**
   * Reads the entire contents of a file
   * @return {Promise} Fulfills with the contents of the file
   */
  static async readFile(filename) {
    let content = '';
    try {
      content = promises.readFile(filename);
    } catch (err) {
      throw Error('Cannot read the file:', err);
    }
    return content;
  }

  /**
   * Searches a document according ID and UserId and updates it
   * @return {Promise} MongoDB document
   */
  static async findAndUpdateFile(id, userId, publicSetting) {
    const filter = { _id: ObjectId(id), userId: ObjectId(userId) };
    const update = { $set: { isPublic: publicSetting } };
    await dbClient.files.updateOne(filter, update);
    return dbClient.files.findOne(filter);
  }

  /**
   * Formats a DB document file data with the required attributes
   * @return {Object}
   */
  static normalizeFile(file) {
    return {
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    };
  }

  /**
   * Collects file documents according pagination settings and parent or/and UserId
   * @return {Promise} Fulfills with an array of DB documents
   */
  static async aggregateAndPaginateDocs(parentId, page, user) {
    const collection = dbClient.db.collection('files');
    let files = [];
    if (parentId) {
      files = await collection.aggregate([
        { $match: { parentId: ObjectId(parentId) } },
        { $skip: 20 * page },
        { $limit: 20 },
      ]).toArray();
    } else {
      files = await collection.aggregate([
        { $match: { userId: ObjectId(user._id) } },
        { $skip: 20 * page },
        { $limit: 20 },
      ]).toArray();
    }
    const newFiles = files.map((file) => File.normalizeFile(file));
    return newFiles;
  }
}

export default File;
