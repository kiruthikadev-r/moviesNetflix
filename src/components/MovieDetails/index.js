import {Component} from 'react'
// import {formatDuration} from 'date-fns'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import FailureView from '../FailureView'
import LoadingView from '../LoadingView'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class MovieDetails extends Component {
  state = {
    movieDetailsList: [],
    similarMoviesList: [],
    spokenLanguagesList: [],
    movieDetailsStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMovieDetailsApiCall()
  }

  componentWillUnmount() {
    this.setState({
      movieDetailsList: [],
      similarMoviesList: [],
      spokenLanguagesList: [],
      movieDetailsStatus: apiStatusConstants.initial,
    })
  }

  getMovieDetailsApiCall = async () => {
    this.setState({movieDetailsStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const originalUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(originalUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const formattedDetails = {
        id: data.movie_details.id,
        title: data.movie_details.title,
        overview: data.movie_details.overview,
        budget: data.movie_details.budget,
        adult: data.movie_details.adult,
        runtime: data.movie_details.runtime,
        genres: data.movie_details.genres,
        releaseDate: data.movie_details.release_date,
        backdropPath: data.movie_details.backdrop_path,
        posterPath: data.movie_details.poster_path,
        voteAverage: data.movie_details.vote_average,
        voteCount: data.movie_details.vote_count,
      }
      const formatSimilarMovies = data.movie_details.similar_movies.map(
        each => ({
          ...each,
          backdropPath: each.backdrop_path,
          posterPath: each.poster_path,
        }),
      )
      const formatSpokenLanguages = data.movie_details.spoken_languages.map(
        each => ({
          ...each,
          englishName: each.english_name,
        }),
      )
      this.setState({
        movieDetailsList: [{...formattedDetails}],
        similarMoviesList: formatSimilarMovies,
        spokenLanguagesList: formatSpokenLanguages,
        movieDetailsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({movieDetailsStatus: apiStatusConstants.failure})
    }
  }

  retry = () => {
    this.getMovieDetailsApiCall()
  }

  renderCasesForVideos = () => {
    const {movieDetailsStatus} = this.state
    switch (movieDetailsStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  renderLoaderView = () => <LoadingView />

  renderFailureView = () => <FailureView onRetry={this.retry} />

  renderSuccessView = () => {
    const {
      movieDetailsList,
      spokenLanguagesList,
      similarMoviesList,
    } = this.state
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    // const duration = formatDuration({movieDetailsList[0].runtime})
    return (
      <>
        <div
          className="top-div"
          style={{backgroundImage: `url(${movieDetailsList[0].backdropPath})`}}
        >
          <Header />
          <div className="poster-div">
            <h1 className="top-head">{movieDetailsList[0].title}</h1>
            <div className="details-div">
              <p className="top-para">
                {Math.floor(movieDetailsList[0].runtime / 60)}h{' '}
                {movieDetailsList[0].runtime % 60}m{/* {duration} */}
              </p>
              <p className="ultra-para">
                {movieDetailsList[0].adult ? 'A' : 'U/A'}
              </p>
              <p className="top-para">
                {new Date(movieDetailsList[0].releaseDate).getFullYear()}
              </p>
            </div>
            <p className="top-para">{movieDetailsList[0].overview}</p>
            <button className="play-btn" type="button">
              Play
            </button>
          </div>
        </div>
        <div className="down-div">
          <ul className="details-list-Ul">
            <li className="genres-list" key="genre" data-testid="genre">
              <h1 className="top-head">Genres</h1>
              {movieDetailsList[0].genres.map(eachGenre => (
                <li key={eachGenre.id}>
                  <p className="top-para">{eachGenre.name}</p>
                </li>
              ))}
            </li>
            <li className="genres-list" key="audios" data-tesid="audios">
              <h1 className="top-head">Audio Available</h1>
              {spokenLanguagesList.map(eachLanguage => (
                <li key={eachLanguage.id}>
                  <p className="top-para">{eachLanguage.englishName}</p>
                </li>
              ))}
            </li>
            <li className="genres-list" key="votes" data-tesid="votes">
              <h1 className="top-head">Rating Count</h1>
              <p className="top-para">{movieDetailsList[0].voteCount}</p>
              <h1 className="top-head">Rating Average</h1>
              <p className="top-para">{movieDetailsList[0].voteAverage}</p>
            </li>
            <li className="genres-list" key="budget" data-tesid="budget">
              <h1 className="top-head">Budget</h1>
              <p className="top-para">{movieDetailsList[0].budget}</p>
              <h1 className="top-head">Release Date</h1>
              <p className="top-para">
                {`${new Date(movieDetailsList[0].releaseDate).getDate()}th
                    ${
                      months[
                        new Date(movieDetailsList[0].releaseDate).getMonth()
                      ]
                    } ${new Date(
                  movieDetailsList[0].releaseDate,
                ).getFullYear()}`}
              </p>
            </li>
          </ul>
          <h1 className="down-head">More like this</h1>
          <ul className="search-result-Ul">
            {similarMoviesList.map(eachItem => (
              <li className="result-list-item" key={eachItem.id}>
                <Link to={`/movies/${eachItem.id}`} target="blank">
                  <img
                    className="thumbnail-img"
                    src={eachItem.posterPath}
                    alt={eachItem.title}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Footer />
      </>
    )
  }

  render() {
    return this.renderCasesForVideos()
  }
}
export default MovieDetails
