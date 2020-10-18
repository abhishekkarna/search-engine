const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
app.use(cors());

app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});

app.get('/api/download', (req, res) => {
    console.log("reQ",req)
    let URL = req.query.URL;
    let type = req.query.type;
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    if (type == "video") {
        ytdl(URL, {
            format: 'mp4'
        }).pipe(res);
    }
})
