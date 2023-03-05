import './css/styles.css';
import photoAPI from './components/photo-api';

import LoadMoreBtn from './components/load-more-btn';
import simpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css"
import OnlyScroll from 'only-scrollbar';
import Notiflix from 'notiflix';

// REFS
const refs = {
  form: document.querySelector(`#search-form`),
  gallery: document.querySelector(`.gallery`),
  sentinel: document.querySelector(`#sentinel`),
  infoText: document.querySelector(`.info-text`),
  searchExample: document.querySelector(`.search-example`),
  searchExampleInput: document.querySelector(`.search-input`),
  btnToStart: document.querySelector(`.button-to-start`)
}


// scroll
const scroll = new OnlyScroll(`html`, {
  damping: 0.4,
  eventContainer: window
});
// btn load more...
const loadMoreBtn = new LoadMoreBtn({
  selector: `[data-action="load-more"]`,
  hidden: true
})
// API
const photoApiService = new photoAPI()
// SimpleLightBox
const lightbox = new simpleLightbox('.gallery-box', {
  captionsData : 'alt',
  captionDelay : 250
})

// events
refs.form.addEventListener(`submit`, onSearch)
loadMoreBtn.refs.button.addEventListener(`click`, loadMoreBtnFunction)
refs.searchExampleInput.addEventListener(`focus`, randomExampleInputSearch)

// functions

// function onSearch
function onSearch (e) {
  e.preventDefault()

  photoApiService.query = e.currentTarget.elements.searchQuery.value.trim()

  if(photoApiService.query === '') {
    return Notiflix.Notify.warning(`The input field cannot be empty.`)
  }

  refs.gallery.classList.remove(`gallery-visible`)

  photoApiService.resetPage()
  clearPhotosMarkup()
  fetchArticles()
  // gallery visible
  setTimeout(() => {
    refs.gallery.classList.add(`gallery-visible`)
  }, 1000)
}

// get Fetch
function fetchArticles() {
  loadMoreBtn.disabled()
  photoApiService.fetchArticles().then(data => {

    refs.sentinel.classList.remove(`loading-hidden`)
    photoApiService.hits = data.totalHits;

    ifContentIsNotFound(data)
    // if the content is over
    if (!data.hits.length || photoApiService.page === 14) {
      refs.sentinel.classList.add(`loading-hidden`)
      loadMoreBtn.ifLastEl()
      
      return loadMoreBtn.ifLastEl()
    }
    IfOnlyContentMoreThanValue(data)
    foundedTotalHits(data)
    makeRenderList(data.hits)
    loadMoreBtn.enable()
  }) 
}

// more btn...
function loadMoreBtnFunction() {
  loadMoreBtn.disabled()
  photoApiService.fetchArticles().then(data => {
    makeRenderList(data.hits)
    loadMoreBtn.enable()
    observer.observe(refs.sentinel)
  }) 
}

// Render Gallery
function makeRenderList(data) {
  let renderData = data.map(el => {
      return `
        <a class="gallery-box" href="${el.largeImageURL}">
          <img class="gallery-img" src="${el.webformatURL}" alt="${el.tags}" loading="lazy">
          <div class="gallery-info-box">
            <ul class="gallery-info-list">
              <li class="gallery-info-item">
                <p class="gallery-info-text">Likes <span>${el.likes}</span></p>
              </li>
              <li class="gallery-info-item">
                <p class="gallery-info-text">Views <span>${el.views}</span></p>
              </li>
              <li class="gallery-info-item">
                <p class="gallery-info-text">Comments <span>${el.comments}</span></p>
              </li>
              <li class="gallery-info-item">
                <p class="gallery-info-text">Downloads <span>${el.downloads}</span></p>
              </li>
            </ul>
          </div>
        
        </a>
        `
    }).join('')

    refs.gallery.insertAdjacentHTML('beforeend', renderData)
    lightbox.refresh()
}

// Observer
async function onEntry(entries) {
  entries.forEach(entry => {
    if(entry.isIntersecting && photoApiService.query !== '') {
      fetchArticles()
    }
  })
}

const options = {
  rootMargin: '50px'
}

const observer = new IntersectionObserver(onEntry,options)

// ===========================
// reset photo if new value
function clearPhotosMarkup() {
  refs.gallery.innerHTML = ''
}

// search example 
function randomExampleInputSearch() {
  const searchSpan = ['Cat', 'Dog', `Cake`,'Science', 'Apple', 'Car', `World`,`Сhemistry`, `Scenery`, `Mountains`, `Sunset` , `Lake`, `Sea`, `Old Building`, `Forest`, `Ukraine`, `Paris`];
  const rand = Math.floor(Math.random() * searchSpan.length);
  refs.searchExample.textContent = searchSpan[rand]
}

// if content is not found
function ifContentIsNotFound(data) {
  if (!data.totalHits) {
    loadMoreBtn.loadingHide();
    loadMoreBtn.hide();
  
    return Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`)
  }
}

// if only content more than 41 element - btn show
function IfOnlyContentMoreThanValue(data) {
  if(data.totalHits > 41) {
    loadMoreBtn.show()
  }
}

// How many totalHits were found 
function foundedTotalHits(data) {
  if(photoApiService.page === 2) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
  }
}