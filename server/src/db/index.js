const knex = require('knex');
const path = require('path');
const fs = require('fs');

const isPostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres');

let dbConfig;

if (isPostgres) {
  dbConfig = {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
    useNullAsDefault: true,
  };
} else {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, 'pashumitra.sqlite');

  dbConfig = {
    client: 'sqlite3',
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
  };
}

const db = knex(dbConfig);

module.exports = db;
