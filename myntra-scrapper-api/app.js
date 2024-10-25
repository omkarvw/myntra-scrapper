const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();


app.use(cors({
    // origin: '*'
    origin: `chrome-extension://${process.env.EXTENSION_ID}`
}));

app.use(bodyparser.json());

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

app.get('/api/hello', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.post('/api/addProductData', (req, res) => {
    const { pid, productName, productPrice, productMrp, productTitle, breadcrumbs, imageUrl } = req.body;

    console.log(req.body);

    if (!pid || !productName || !productPrice || !productMrp || !productTitle || !breadcrumbs || !imageUrl) {
        return res.status(400).json({
            error: 'Missing required parameters'
        });
    }

    const siteId = 0; // site id for the site from which the data is being scraped
    // send the breadcrumb array as a json object
    const bc = JSON.stringify(breadcrumbs);

    const checkSql = 'SELECT * FROM productData WHERE pid = ? AND siteID = ?';
    db.query(checkSql, [pid, siteId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Database error'
            });
        }

        if (result.length > 0) {
            const updateSql = 'UPDATE productData SET name = ?, price = ?, mrp = ?, title = ?, breadcrumbs = ?, imageUrl = ?, updated_at = NOW() WHERE pid = ? AND siteID = ?';
            db.query(updateSql, [productName, productPrice, productMrp, productTitle, bc, imageUrl, pid, siteId], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: 'Database error'
                    });
                }
                res.json({
                    message: 'Product data updated successfully.',
                });
            });
        }
        else {
            const insertSql = 'INSERT INTO productData (pid, name, price, mrp, title, breadcrumbs, imageUrl, siteID) VALUES (?,?,?,?,?,?,?,?)';
            db.query(insertSql, [pid, productName, productPrice, productMrp, productTitle, bc, imageUrl, siteId], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: 'Database error'
                    });
                }
                res.json({
                    message: 'Product data inserted successfully.',
                });
            });
        }
    });
}
);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
