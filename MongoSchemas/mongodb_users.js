// Create collection for username and passwords

db.createCollection('users', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' }
        }
      }
    }
  });

// Enforce uniqueness of username
db.users.createIndex({ username: 1 }, { unique: true });

// Add default admin account
db.users.insert({
    username: 'admin',
    password: 'admin',
  });