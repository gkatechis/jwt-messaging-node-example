// Utilities we need
import fs from 'fs';
import bcrypt from 'bcrypt';

// Initialize the database
import sqlite3 from 'sqlite3';
const dbFile = './data/users.db';
export const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.log(err)
  } else if (err && err.code) {
    console.log(err.code);
  } else {
    createDatabase();
  }
});

const createDatabase = () => {
  const salt = bcrypt.genSaltSync(10);
  const password = 'password123';
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS Users (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        FirstName TEXT NOT NULL,
        LastName TEXT NOT NULL,
        Email TEXT NOT NULL UNIQUE,
        Password TEXT NOT NULL,
        Salt TEXT NOT NULL
        CHECK (length(Password) >= 7)
      )`,
      (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log('Table Users created.');
          insertUsersWithTransaction();
        }
      }
    );
  });
};

const insertUsersWithTransaction = () => {
  const salt = bcrypt.genSaltSync(10);
  const password = 'password123';

  // Start the transaction
  db.run('BEGIN TRANSACTION', (err) => {
    if (err) {
      console.error('Error starting transaction:', err.message);
      return;
    }

    const insert = 'INSERT OR IGNORE INTO Users (FirstName, LastName, Email, Password, Salt) VALUES (?,?,?,?,?)';

    // List of users to be inserted
    const users = [
      ['Bob', 'Smith', 'bsmith@example.com', bcrypt.hashSync(password, salt), salt],
      ['John', 'Rogers', 'jrogers@example.com', bcrypt.hashSync(password, salt), salt],
      ['Lisa', 'Thompson', 'lthompson@example.com', bcrypt.hashSync(password, salt), salt],
    ];

    // Function to insert a user from the list
    const insertNext = () => {
      if (users.length > 0) {
        const user = users.shift();
        db.run(insert, user, function (err) {
          if (err) {
            console.error('Error inserting user:', err.message);
            db.run('ROLLBACK', (rollbackErr) => {
              if (rollbackErr) {
                console.error('Error rolling back transaction:', rollbackErr.message);
              }
            });
          } else {
            insertNext(); // Continue with the next user
          }
        });
      } else {
        // No more users to insert, so commit the transaction
        db.run('COMMIT', (err) => {
          if (err) {
            console.error('Error committing transaction:', err.message);
          } else {
            console.log('All users inserted successfully, transaction committed.');
          }
        });
      }
    };

    // Start inserting users
    insertNext();
  });
};