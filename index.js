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


const pg = require('pg');

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

pool.connect((err) => {
  if (err) throw err;
  console.log("base de datos conectada");
});

  // Definir el modelo User
 
  // Sincronizar el modelo con la base de datos
  

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

app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al obtener el usuario.' });
  }
});

app.post('/users', async (req, res) => {
  const { first_name, last_name, email, favs } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, favs) VALUES ($1, $2, $3, $4) RETURNING *',
      [first_name, last_name, email, favs]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al crear el usuario.' });
  }
});


  app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [userId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.json({ message: 'Usuario eliminado con éxito', user: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al eliminar el usuario.' });
    }
  });

  app.put('/users/:id/favs', async (req, res) => {
    const userId = req.params.id;
    const { favs: newFavs } = req.body;
  
    try {
      // Obtener el contenido actual de favs del usuario
      const result = await pool.query(
        'SELECT favs FROM users WHERE id = $1',
        [userId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const { favs: currentFavs } = result.rows[0];
  
      // Concatenar el nuevo contenido con el existente
      const updatedFavs = currentFavs ? `${currentFavs}, ${newFavs}` : newFavs;
  
      // Actualizar favs del usuario con el nuevo contenido
      await pool.query(
        'UPDATE users SET favs = $1 WHERE id = $2',
        [updatedFavs, userId]
      );
  
      // Responder con el usuario actualizado
      res.json({ id: userId, favs: updatedFavs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al actualizar los favs del usuario.' });
    }
  });
  
  // Endpoint para eliminar todo el contenido de favs
  app.delete('/users/:id/favs', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const result = await pool.query(
        'UPDATE users SET favs = NULL WHERE id = $1 RETURNING *',
        [userId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al eliminar los favs del usuario.' });
    }
  });


  //eliminar elemento especifico 

  app.delete('/users/:id/favss', async (req, res) => {
    const userId = req.params.id;
    const elementToRemove = req.body.element;
  
    if (!elementToRemove) {
      return res.status(400).json({ error: 'Se requiere especificar el elemento a eliminar en el cuerpo de la solicitud.' });
    }
  
    try {
      // Obtener el contenido actual de favs del usuario
      const result = await pool.query(
        'SELECT favs FROM users WHERE id = $1',
        [userId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const { favs: currentFavs } = result.rows[0];
  
      // Verificar si el elemento a eliminar está en la lista
      if (!currentFavs || !currentFavs.includes(elementToRemove)) {
        return res.status(404).json({ error: 'El elemento especificado no existe en favs' });
      }
  
      // Eliminar el elemento específico de la lista
      const updatedFavs = currentFavs.split(', ').filter(item => item !== elementToRemove).join(', ');
  
      // Actualizar favs del usuario con la lista modificada
      await pool.query(
        'UPDATE users SET favs = $1 WHERE id = $2',
        [updatedFavs, userId]
      );
  
      // Responder con el usuario actualizado
      res.json({ id: userId, favs: updatedFavs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al eliminar el elemento de favs.' });
    }
  });
// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


//hacer npm install ya que se añadio la dependencia de pg

