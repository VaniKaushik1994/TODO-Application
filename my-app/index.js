const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const port = 3001; // or any other port you prefer

app.use(require('./routes'));

app.get('/api/data', (req, res) => {
  // Handle your API logic here
  const data = { message: 'Hello from the server!' };
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});