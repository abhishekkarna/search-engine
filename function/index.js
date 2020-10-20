const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid')
const ytdl = require('ytdl-core');
const app = express();
const request = require("request")
const { join, parse } = require("path")
// import { join, parse } from "path";
app.use(cors());
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: 'my-protfolio-283519-178d8041d436.json' });
// Replace with your bucket name and filename.
const bucketname = 'search_engine';
app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});

app.get('/api/download', function (req, res) {
    let videoUrl = req.query.URL;
    let destDir = "dummy";
    let type = req.query.type;

    if (!["audio", "video"].includes(type)) return { status: false, error: "Invalid download type" }

    let videoReadableStream = (type === "audio") ? ytdl(videoUrl, { filter: 'audioonly' }) : ytdl(videoUrl, { filter: 'video' });

    ytdl.getInfo(videoUrl, async function (err, info) {
        let destination;
        let videoName = info.title.replace('|', '').toString('ascii');
        if (type == "audio") {
            destination = destDir + "/" + videoName + ".mp3";
        } else {
            destination = destDir + "/" + videoName + ".mp4";
        }
        const bucket = await storage.bucket(bucketname, destination);
        const fs = bucket.file(destination);
        let videoWritableStream = fs.createWriteStream(destination);
        var stream = videoReadableStream.pipe(videoWritableStream);
        stream.on("drain", function (e) {
            console.log("drain",e)
        })
        stream.on('finish', function () {
            res.writeHead(204);
            res.end();
        });
    });
});