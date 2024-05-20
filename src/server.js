const express = require('express');

const app = express();
const PORT = process.env.PORT || 42800;

// Define the base URLs of the APIs
const endpoints = [
    'http://fr.htn.pool.hoosat.fi',
    'http://fr.pool.hoosat.fi'
];

// Define the endpoint to forward requests to
const endpoint = '/data';

const router = express.Router();

const forwardToEndpoints = async (req, res, next) => {
  try {
      let responses = {};
      
      for (const baseUrl of endpoints) {
          const fullUrl = `${baseUrl}${req.originalUrl}`;
          console.log(fullUrl);
          const response = await fetch(fullUrl);
          
          if (response.ok) {
              const data = await response.json();
              responses = {...responses, ...data}
          }
      }

      // Send the aggregated responses as JSON
      res.json(responses);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Mount the router
app.use('/api', forwardToEndpoints);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});