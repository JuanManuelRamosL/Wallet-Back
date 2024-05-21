require('dotenv').config(); // Cargar variables de entorno desde .env

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: 1111, // Añadir esta línea para especificar el puerto
  },
  // Puedes añadir configuraciones para otros entornos como producción, test, etc.
};