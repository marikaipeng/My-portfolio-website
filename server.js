// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an instance of express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/example', (req, res) => {
    res.send({ message: 'This is an example route' });
});

// Other route definitions go here...

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
