import Queue from 'bull';
import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import ErrorHandler from '../utils/error';
import redisClient from '../utils/redis';

class UsersController {
  /**
   * POST /users
   * Check the request body for user's 'email' and 'password'. If user already exists
   * should response with 400, otherwise create a new user in the DB using 'dbClient'.
   *
   * @param  {Object} request  - HTTP request object
   * @param  {Object} response - HTTP response object
   * @return {Object} http response
   */
  static async postNew(request, response) {
    const { email, password } = request.body;
    const userQueue = new Queue('userQueue');
    if (!email) return ErrorHandler.missingData(response, 'email');
    if (!password) return ErrorHandler.missingData(response, 'password');

    const user = await dbClient.users.findOne({ email });
    if (user) return ErrorHandler.alreadyExist(response);

    const newUser = await dbClient.users.insertOne({
      email,
      password: sha1(password),
    });
    userQueue.add({ userId: newUser.ops[0]._id });
    return response.status(201).json({ id: newUser.ops[0]._id, email });
  }

  /**
   * GET /users/me
   * Should retrieve the user base on the token used.
   *
   * @param  {Object} request  - HTTP request object
   * @param  {Object} response - HTTP response object
   * @return {Object} http response with user object or 'Unauthorized' error
   */
  static async getMe(request, response) {
    const token = request.header('X-Token');
    const userID = await redisClient.get(`auth_${token}`);
    if (!userID) return ErrorHandler.unauthorizedUser(response);
    const user = await dbClient.users.findOne({ _id: ObjectId(userID) });
    if (!user) return ErrorHandler.unauthorizedUser(response);
    return response.json({ id: user._id, email: user.email });
  }
}

export default UsersController;
