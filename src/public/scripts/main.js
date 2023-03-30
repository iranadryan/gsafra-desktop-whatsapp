/* eslint-disable no-undef */
const loaderElement = document.querySelector('#loader-root .overlay');
const qrcodeElement = document.querySelector('.app .qrcode img');
const refreshButtonElement = document.querySelector('.app .left-side .refresh-button');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

loaderElement.addEventListener('animationend', (e) => {
  if (e.animationName === 'fade-out') {
    loaderElement.classList.value = 'overlay hide';
  }
});

function isLoading(isLoading) {
  if (isLoading) {
    loaderElement.classList.value = 'overlay is-opening';
  } else {
    loaderElement.classList.value = 'overlay is-leaving';
  }
}

async function loadQrcode() {
  isLoading(true);

  await delay(1000);

  const { data } = await axios.get('/qrcode');

  qrcodeElement.setAttribute('src', data.qrcode);
  isLoading(false);
}

refreshButtonElement.addEventListener('click', async () => {
  await loadQrcode();
});

loadQrcode();
