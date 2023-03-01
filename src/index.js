import './css/styles.css';
import { Notify } from 'notiflix';
import axios from 'axios';

const input = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const API_KEY = '34035283-4d31da2bf260205eb23ca149e';
let page = 1;
let storedValue = null;

async function fetcImages(searchText) {
    const response = await axios.get(
        `https://pixabay.com/api/?key=${API_KEY}&q=${searchText}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}
          `
      );

  return response.data; 
}

searchBtn.addEventListener('click', async event => {
  event.preventDefault();
  if (storedValue !== input.value) {
    page = 1;
    storedValue = input.value;
  }

  loadMoreBtn.classList.add('is-hidden');

  const response = await fetcImages(input.value);

  Notify.info(`Hooray! We found ${response.totalHits} images.`);

  if (response.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    const galleryElements = response.hits.map(
      image => `<div class="photo-card">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="300" />
        <div class="info">
          <p class="info-item">
            <b>Likes: ${image.likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${image.views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${image.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${image.downloads}</b>
          </p>
        </div>
      </div>`
    );

    gallery.innerHTML = galleryElements.join('');
  }

  loadMoreBtn.classList.remove('is-hidden');
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;

  try {
    const response = await fetcImages(input.value);

    const galleryElements = response?.hits.map(
      image =>
        `<div class="photo-card">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="300"/>
            <div class="info">
                <p class="info-item">
                <b>Likes: ${image.likes}</b>
                </p>
                <p class="info-item">
                <b>Views: ${image.views}</b>
                </p>
                <p class="info-item">
                <b>Comments: ${image.comments}</b>
                </p>
                <p class="info-item">
                <b>Downloads: ${image.downloads}</b>
                </p>
            </div>
            </div>`
    );
    gallery.insertAdjacentHTML('beforeend', galleryElements);
    if (gallery.children.length === response.totalHits) {
      loadMoreBtn.classList.add('is-hidden');
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch {}
});
