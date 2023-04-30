const ytdl = require('ytdl-core');
const fs = require('fs');

async function fname(url) {
  let id = ytdl.getURLVideoID(url)
  let info = await ytdl.getInfo(id);
  
  console.log(info)
  fs.writeFileSync('res.json', JSON.stringify(info));
}

fname("https://youtu.be/vodDbbjlP6c")