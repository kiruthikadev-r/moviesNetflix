import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

import Footer from '../Footer'
import FailureView from '../FailureView'
import LoadingView from '../LoadingView'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Popular extends Component {
  state = {
    allVideosList: [],
    getVideosStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getSearchVideosApiCall()
  }

  getSearchVideosApiCall = async () => {
    this.setState({getVideosStatus: apiStatusConstants.inProgress})
    const searchApiUrl = 'https://apis.ccbp.in/movies-app/popular-movies'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const response = await fetch(searchApiUrl, options)
      if (response.ok === true) {
        const data = await response.json()
        const formattedSearchResult = data.results.map(eachItem => ({
          ...eachItem,
          backdropPath: eachItem.backdrop_path,
          posterPath: eachItem.poster_path,
        }))
        this.setState({
          getVideosStatus: apiStatusConstants.success,
          allVideosList: formattedSearchResult,
        })
      } else {
        this.setState({getVideosStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      this.setState({getVideosStatus: apiStatusConstants.failure})
    }
  }

  retry = () => {
    this.getSearchVideosApiCall()
  }

  renderCasesForVideos = () => {
    const {getVideosStatus} = this.state
    switch (getVideosStatus) {
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
    const {allVideosList} = this.state
    console.log('Rendering success view...') // Log to check if the method is being called
    console.log('allVideosList:', allVideosList) // Log the content of allVideosList

    return (
      <ul className="search-result-Ul">
        {allVideosList.length > 0 ? (
          allVideosList.map(eachItem => (
            <li className="movie-item" key={eachItem.id}>
              <Link to={`/movies/${eachItem.id}`}>
                <img
                  src={eachItem.posterPath}
                  alt={eachItem.title}
                  className="movie-item-image"
                />
              </Link>
            </li>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </ul>
    )
  }

  render() {
    return (
      <div className="search-div">
        <Header />
        <h1 className="top-head" style={{marginLeft: '50px'}}>
          Explore the Popular Movies Here
        </h1>
        {this.renderCasesForVideos()}
        <Footer />
      </div>
    )
  }
}

export default Popular
