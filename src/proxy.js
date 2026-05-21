const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3001; // Make sure this port is not in use

app.use(cors());

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  console.log('start proxy');
  console.log(targetUrl);
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log('x1');
    const response = await fetch(targetUrl);
    const data = await response.text();
    console.log(data);
    res.set('Content-Type', response.headers.get('Content-Type'));
    res.send(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).json({ error: 'Error fetching the URL' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
