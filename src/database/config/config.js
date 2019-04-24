module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    operatorsAliases: false,
    dialect: 'postgres',
    logging: false
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    operatorsAliases: false,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    operatorsAliases: false,
    dialect: 'postgres',
    logging: false
  }
};
