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
  clearGallery();
  btnLoadMore.classList.add('hidden');
  showLoader();

  try {
    const { hits, totalHits: newTotalHits } = await fetchImages(query, page);
    totalHits = newTotalHits;

    if (hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    renderImages(hits);

    if (totalHits > 15) {
      btnLoadMore.classList.remove('hidden');
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Oops! Something went wrong. Please try again later.',
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

  try {
    const { hits } = await fetchImages(query, page);

    if (hits.length === 0) {
      btnLoadMore.classList.add('hidden');
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      return;
    }

    renderImages(hits);

    const listHeight = document
      .querySelector('.gallery-item')
      .getBoundingClientRect().height;
    window.scrollBy({ top: listHeightHeight * 2, behavior: 'smooth' });

    if (page * 15 >= totalHits) {
      btnLoadMore.classList.add('hidden');
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {

  } finally {
    hideLoader();
  }
});
