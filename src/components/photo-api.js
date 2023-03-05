import axios from "axios"
import Notiflix from "notiflix"

const BASE_URL = `https://pixabay.com/api/`
const API_KEY = `33943342-a062799c31b03d09b9648bb90`

export default class PhotoApiService {
  constructor() {
    this.searchQuery = ''
    this.page = 1
  }

  async fetchArticles() {
    
    const options = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: `photo`,
      orientation: `horizontal`,
      safesearch: true,
      per_page: 40,
      page: this.page,
    })

    try {
      const responce = await axios.get(`${BASE_URL}?${options.toString()}`)
      this.incrementPage()
      console.log(responce.data)
      return responce.data
    } catch (error) {
      console.log(error)
      return Notiflix.Notify.failure(`System error`)
    }
  }
  // nextPage
  incrementPage() {
    this.page += 1
  }

  // resetPage
  resetPage() {
  this.page = 1
  }

  // get
  get query() {
    return this.searchQuery
  }
  // set
  set query(newQuery) {
    this.searchQuery = newQuery
  }
}

