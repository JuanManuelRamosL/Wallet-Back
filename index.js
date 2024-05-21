const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3100;
app.use(cors());
app.use(bodyParser.json());
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT || 1111, // Usar el puerto de la variable de entorno o el puerto 5432 por defecto
  });

  sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada y tabla Users recreada.');
  })
  .catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
  });

  // Definir el modelo User
const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    favs:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
  }, {
    // Otros parámetros del modelo
  });
  
  // Sincronizar el modelo con la base de datos
  sequelize.sync();

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': 'a4ec15fb-20b5-4f6c-996c-9d6c556e9412',
            },
        });

        res.json(response.data); // Devuelve los datos de la respuesta como JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al obtener los datos de la API.' });
    }
});

app.get('/map', async (req, res) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=20', {
            headers: {
                'X-CMC_PRO_API_KEY': 'a4ec15fb-20b5-4f6c-996c-9d6c556e9412',
            },
        });

        res.json(response.data); // Devuelve los datos de la respuesta como JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al obtener los datos de la API.' });
    }
});

app.get('/map2', async (req, res) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=30', {
            headers: {
                'X-CMC_PRO_API_KEY': 'a4ec15fb-20b5-4f6c-996c-9d6c556e9412',
            },
        });

        res.json(response.data); // Devuelve los datos de la respuesta como JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al obtener los datos de la API.' });
    }
});

app.get('/exchange', async (req, res) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/exchange/info', {
            
            headers: {
                'X-CMC_PRO_API_KEY': 'a4ec15fb-20b5-4f6c-996c-9d6c556e9412',
            },params: {
               slug:"binance,gdax,kraken"
            }
        });

        res.json(response.data); // Devuelve los datos de la respuesta como JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al obtener los datos de la API.' });
    }
});

app.post('/info', async (req, res) => {
    try {
        const {name} = req.body
        const crypto = name.toLowerCase();
        const response = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/info', {
            params: {
                slug: crypto, // Pasar los IDs como parámetro de consulta
            },
            headers: {
                'X-CMC_PRO_API_KEY': 'a4ec15fb-20b5-4f6c-996c-9d6c556e9412',
            },
        });

        res.json(response.data); // Devuelve los datos de la respuesta como JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al obtener los datos de la API.' });
    }
});

app.post('/price', async (req, res) => {
    try {
        const {name} = req.body
        const crypto = name.toLowerCase();
        const response = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest', {
            params: {
                slug: crypto, // Pasar los IDs como parámetro de consulta
            },
            headers: {
                'X-CMC_PRO_API_KEY': 'a4ec15fb-20b5-4f6c-996c-9d6c556e9412',
            },
        });

        res.json(response.data); // Devuelve los datos de la respuesta como JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al obtener los datos de la API.' });
    }
});

app.get('/map3', async (req, res) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/exchange/map?limit=15', {
            headers: {
                'X-CMC_PRO_API_KEY': 'a4ec15fb-20b5-4f6c-996c-9d6c556e9412',
            },
        });

        res.json(response.data); // Devuelve los datos de la respuesta como JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al obtener los datos de la API.' });
    }
});


//usuarios
app.post('/users', async (req, res) => {
    try {
      const { firstName, lastName, email,favs } = req.body;
      const newUser = await User.create({ firstName, lastName, email,favs });
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al crear el usuario.' });
    }
  });


// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});




// config de conexion a bd desplegada 
/* const sequelize = new Sequelize("postgres://juan:mgrSUsNkOyQuK5lQQipKsSo8281Duvde@dpg-co8lteol5elc739184eg-a.oregon-postgres.render.com/bd_galery", {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Deshabilita la verificación del certificado SSL
    }
  }
}); */