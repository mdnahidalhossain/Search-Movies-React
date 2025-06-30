import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite.js'

const MOVIE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

function App() {
  const [searchItem, setSearchItem] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [movies, setMovies] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  async function fetchMovies(query = '') {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const movieUrl = query
        ? `${MOVIE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${MOVIE_URL}/discover/movie?sort_by=popularity.desc`

      const fetchMoviesFromApi = await fetch(movieUrl, API_OPTIONS)

      // alert(fetchMoviesFromApi)

      if (!fetchMoviesFromApi.ok) {
        throw new Error('Failed to fetch movies')
      }

      const data = await fetchMoviesFromApi.json()

      console.log(data)

      if (data.Response == 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies')

        setMovies([])
        return;
      }

      setMovies(data.results || [])
      // updateSearchCount()
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }

    } catch (error) {
      console.error(`Error fetching data: ${error}`)
      setErrorMessage(`Error fetching data.`)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadTrendingMovies() {
    try {
      const trendingMovies = await getTrendingMovies()
      setTrendingMovies(trendingMovies)

    } catch (error) {
      console.error("Loading trending movies error:", error);
    }
  }

  useEffect(() => {
    fetchMovies();
    loadTrendingMovies();
  }, []);

  useDebounce(
    () => {
      if (searchItem.trim()) {
        fetchMovies(searchItem);
      }
    },
    500,
    [searchItem]
  );

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src="./hero-img.png" alt="hero-image" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>

          <Search search={searchItem} setSearch={setSearchItem}></Search>
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((tmovies, index) => (
                <li key={tmovies.$id}>
                  <p>{index+1}</p>
                  <img src={tmovies.movieposter_url} alt={tmovies.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className='all-movies'>
          <h2>All Movies</h2>
          {/* {errorMessage && <p className='text-red-500'>{errorMessage}</p>} */}

          {isLoading ? (

            <Spinner></Spinner>

          ) : errorMessage ? (
            <p className='text-red'>{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} showMovie={movie}></MovieCard>
              ))}
            </ul>
          )}
        </section>

      </div>


    </main>
  )
}

export default App
