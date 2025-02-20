import { defineFunction, secret } from '@aws-amplify/backend';

export const mysqlHandler = defineFunction({
  name: 'mysql-handler',
  entry: './handler.ts',
  environment: {
    DB_HOST: process.env.DB_HOST || 'localhost', // Variable de entorno
    DB_USER: process.env.DB_USER || 'default_user', // Variable de entorno
    DB_PASSWORD: secret('DB_PASSWORD'), // Secreto (debe estar definido en Amplify)
    DB_NAME: process.env.DB_NAME || 'default_db', // Variable de entorno
  },
});