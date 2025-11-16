const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'Project')));

// Route to serve main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Project', 'first_page', 'firstpage.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'Project', 'login', 'login-page.html'));
});

app.get('/inventory', (req, res) => {
  res.sendFile(path.join(__dirname, 'Project', 'inventory', 'inventory.html'));
});

app.get('/billing', (req, res) => {
  res.sendFile(path.join(__dirname, 'Project', 'billing', 'billing.html'));
});

// Mock API endpoints for PHP backend calls
app.get('/login/get_products.php', (req, res) => {
  res.json({ message: 'PHP backend not available - running in static mode' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Note: PHP backend endpoints are not available in this environment');
});
