const express     = require('express');
const ytdl        = require('ytdl-core');
const fs          = require('fs');
const ejs         = require('ejs');
const https       = require("https");
const axios       = require('axios');
const bodyParser  = require("body-parser");
const cors        = require('cors');
const app         = express();
const maintenance = false;

setInterval(() => {
  console.log("1 jam ....")
  fs.readdirSync("./temp/media/rtmp4").map((a) => {
    if (a == `media`) { return } else {
      console.log(a)
      fs.unlinkSync(`./temp/media/rtmp4/${a}`)
    }
  })
}, 1000 * 60 * 60); 

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', async (req, res) => {
  if (maintenance) {
    res.render('pages/maintenance');
  }else {
    res.status(200);
    res.render('pages/index');
  }
});
app.post('/download', async (req, res) => {
  let url = req.body.url;
  let idv = ytdl.getURLVideoID(url);
  let rtube = await ytdl.getInfo(idv);
  
  let idn = 'RTube - ' + rtube.videoDetails.title
  console.log(`Starting download: \nURL: ${url}`)
  var comMin = Math.floor(rtube.videoDetails.lengthSeconds/60);
  var comSec = rtube.videoDetails.lengthSeconds % 60;
  let duration = `${comMin}.${comSec}`

  res.status(200);
  res.render('pages/download', { rtube: rtube, duration: duration, url: url, idn: idn })

})
app.get('/download', async (req, res) => {
  let url  = req.query.url;
  let type = req.query.type;
  let idn  = req.query.idn;
  
  if (ytdl.validateURL(url)) {
    if (type == 'rtmp3') {
      try {
        ytdl(url, {
          filter: 'audioonly',
          format: 'mp3',
          quality: 'highest'
        }).pipe(fs.createWriteStream(`./temp/media/${type}/${idn}.mp3`)).on('finish', () => {
          res.status(200);
          try {
            res.download(`./temp/media/${type}/${idn}.mp3`, { root: __dirname });
          } catch (error) {
            console.error(error);
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else if (type == 'rtmp4') {
      try {
        ytdl(url, {
          filter: 'audioandvideo',
          format: 'mp4',
          quality: 'highest'
        }).pipe(fs.createWriteStream(`./temp/media/${type}/${idn}.mp4`)).on('finish', () => {
          res.status(200);
          try {
            res.download(`./temp/media/${type}/${idn}.mp4`, { root: __dirname });
          } catch (error) {
            console.error(error);
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      res.redirect('/')
    }
  } else {
    res.redirect('/');
  }
})

app.get('*', async (req, res) => { res.redirect('/'); });
app.listen(process.env.PORT, () => { console.log(`[SYSTEM] RTube is Running..!`); });
