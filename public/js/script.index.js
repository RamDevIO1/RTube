const btn_paste = document.querySelector("#paste")
const input = document.querySelector("#inputurl")
const btndown = document.querySelector("#btndown")

btn_paste.addEventListener('click', () => {
  navigator.clipboard.readText().then(v => input.value = v);
});
