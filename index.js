const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3100;
app.use(cors());
app.use(bodyParser.json());
// Ruta para obtener los datos de la API de CoinMarketCap
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
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=15', {
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
// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});