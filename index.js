require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
const urls = [];
let count = 1;

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  urls.push({ original_url: originalUrl, short_url: count });
  count++;

  res.json({ original_url: originalUrl, short_url: count - 1 });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = parseInt(req.params.shortUrl);

  const foundUrl = urls.find(url => url.short_url === shortUrl);

  if (foundUrl) {
    res.redirect(foundUrl.original_url);
  } else {
    res.json({ error: 'URL not found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
