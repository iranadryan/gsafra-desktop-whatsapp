/* eslint-disable no-undef */
const loaderElement = document.querySelector('#loader-root .overlay');
const disconnectButtonElement = document.querySelector('.app .left-side .disconnect-button');

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

async function disconnect() {
  isLoading(true);

  await axios.get('/disconnect');
  await delay(1000);
  isLoading(false);
  window.location.href = '/';
}

disconnectButtonElement.addEventListener('click', () => {
  disconnect();
});
