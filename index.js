const express = require('express');
const fs      = require('fs');
const crypto  = require('crypto');

/* Express Middleware */
const multer  = require('multer');
const upload  = multer();

/* Routers/Handlers */
const app     = express();
const router  = express.Router();

/* Config */
const rootdir = __dirname;
//const port    = 80;

/* Server Routes */

router.get('/', (req, res) => {

    res.send('Image Hosting');

});

router.post('/upload', upload.any(), (req, res) => {

    if (!req.headers['authorization'] || !getKeys().includes(req.headers['authorization']))
        return res.status(401).json({ error: 'Unauthorized' });

    const type = req.files[0].originalname.split('.')[1] || 'png';

    const path = `${crypto.randomBytes(5).toString('hex')}.${type}`;

    fs.writeFile(`${rootdir}/i/${path}`, req.files[0].buffer, (err) => {

        if (err)
            return res.status(500).json({ error: 'Internal error occurred while writing the image data' });
        
        return res.status(200).json({ path });

    })

});

router.get('/i/*', (req, res) => {

    console.log(req.path)

    fs.access(`${rootdir}/${req.path}`, fs.constants.R_OK, (err) => {

        if (err) return notFound(req, res);

        res.sendFile(`${rootdir}/${req.path}`);

    });

});

app.use(router);


app.listen();

/* Custom Functions */
function getKeys() {
    const keys = require('./keys');
    delete require.cache[require.resolve('./keys')];
    return keys;
}
