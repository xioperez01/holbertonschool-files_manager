import { v4 as uuidv4 } from 'uuid';
import ErrorHandler from '../utils/error';
import redisClient from '../utils/redis';
import User from '../utils/user';

class AuthController {
  /**
   * GET /connect
   * Should sign-in the user by generating a new authentication token.
   *
   * @param  {Object} request  - HTTP request object
   * @param  {Object} response - HTTP response object
   * @return {Object} http response
   */
  static async getConnect(request, response) {
    const credentials = request.header('Authorization');
    if (!credentials) return ErrorHandler.unauthorizedUser(response);

    const validUser = await User.validUser(credentials);
    if (validUser === null) return ErrorHandler.unauthorizedUser(response);

    const token = uuidv4();
    await redisClient.set(`auth_${token}`, validUser._id.toString(), 60 * 60 * 24);
    return response.status(200).json({ token });
  }

  /**
   * GET /disconnect
   * Should sign-out the user based on the token.
   *
   * @param  {Object} request  - HTTP request object
   * @param  {Object} response - HTTP response object
   * @return {Object} http response
   */
  static async getDisconnect(request, response) {
    const token = request.header('X-Token');
    if (!token) return ErrorHandler.unauthorizedUser(response);

    const key = `auth_${token}`;
    const user = await redisClient.get(key);
    if (!user) return ErrorHandler.unauthorizedUser(response);
    await redisClient.del(key);
    return response.status(204).end();
  }
}

export default AuthController;
