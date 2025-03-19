import { fetchImages } from './js/pixabay-api.js';
import {
  renderImages,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = form.querySelector('input');
const btnLoadMore = document.querySelector('.btn-load');

let query = '';
let page = 1;
let totalHits = 0;

btnLoadMore.classList.add('hidden');

form.addEventListener('submit', async event => {
  event.preventDefault();

  query = input.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term!',
      position: 'topRight',
    });
    return;
  }

  page = 1;
  totalHits = 0; // Очищуємо перед новим пошуком
  clearGallery();
  btnLoadMore.classList.add('hidden');
  showLoader();

  try {
    const { hits, totalHits: newTotalHits } = await fetchImages(query, page);
    totalHits = newTotalHits;

    if (hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: `Sorry, no images found for "${query}".`,
        position: 'topRight',
      });
      return;
    }

    renderImages(hits);

    if (page * 15 < totalHits) {
      btnLoadMore.classList.remove('hidden');
    } else {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Oops! Something went wrong. Try again later.',
      position: 'topRight',
    });
    console.error('Error fetching images:', error);
  } finally {
    hideLoader();
  }
});

btnLoadMore.addEventListener('click', async () => {
  page++;
  showLoader();
  btnLoadMore.classList.add('hidden'); // Ховаємо кнопку перед запитом

  try {
    const { hits } = await fetchImages(query, page);
    renderImages(hits);
    smoothScroll();

    if (page * 15 >= totalHits) {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      btnLoadMore.classList.remove('hidden');
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Oops! Something went wrong. Try again later.',
      position: 'topRight',
    });
    console.error('Error fetching images:', error);
  } finally {
    hideLoader();
  }
});

function smoothScroll() {
  const cardHeight =
    document.querySelector('.gallery-item')?.getBoundingClientRect().height ||
    150;
  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}
