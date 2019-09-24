module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/database.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations',
      tableName: 'migrations'
    },
    seeds: { directory: './seeds' } 
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
