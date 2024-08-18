const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const GENERATED_CODES_DIR = path.join(__dirname, 'user-codes');

// Ensure the user-codes directory exists
if (!fs.existsSync(GENERATED_CODES_DIR)) {
    fs.mkdirSync(GENERATED_CODES_DIR);
}

// Serve static files
app.use(express.static(GENERATED_CODES_DIR));

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Deploy route
app.post('/deploy', (req, res) => {
    const userCode = req.body.code;
    const uniqueId = Math.random().toString(36).substr(2, 8); // Generate a random string

    const filePath = path.join(GENERATED_CODES_DIR, `${uniqueId}.html`);

    fs.writeFile(filePath, userCode, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Internal Server Error');
        }

        const deployedUrl = `${req.protocol}://${req.get('host')}/${uniqueId}.html`;
        res.json({ url: deployedUrl });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
