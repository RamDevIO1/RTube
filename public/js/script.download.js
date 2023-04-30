const a = document.querySelector(".card-title")
const shareBtn = document.getElementById('share')

let trimString = function(string, length) { return string.length > length ? string.substring(0, length) + '...' : string; };
a.innerHTML = trimString(a.innerHTML, 95)

shareBtn.addEventListener('click', event => {
  if (navigator.share) {
    navigator.share({
        text: 'Want to download YouTube videos and songs? Try RTube now!',
        url: 'https://rtube.ramsnode.me/'
      }).then(() => { alert("thanks for sharing! :)") }).catch((err) => console.error(err));
  } else {
    alert("The current browser does not support the share function. :(")
  }
});

