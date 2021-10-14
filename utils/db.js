import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const DATABASE = process.env.DB_DATABASE || 'files_manager';
    const URI = `mongodb://${host}:${port}/`;
    this.connected = false;

    MongoClient.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }, (err, client) => {
      if (!err) {
        this.db = client.db(DATABASE);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
        this.connected = true;
      } else {
        this.connected = false;
        throw err;
      }
    });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
