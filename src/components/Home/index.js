import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import LoadingView from '../LoadingView'
import Footer from '../Footer'
import SliderView from '../SliderView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class Home extends Component {
  state = {
    topView: {},
    trendingMovies: [],
    trendingStatus: apiStatusConstants.initial,
    originalMovies: [],
    originalStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrendingApiCall()
    this.getOriginalApiCall()
  }

  retry = () => {
    this.getOriginalApiCall()
  }

  retryTrending = () => {
    this.getTrendingApiCall()
  }

  getTrendingApiCall = async () => {
    this.setState({trendingStatus: apiStatusConstants.inProgress})
    const trendingUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(trendingUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedTrending = data.results.map(eachItem => ({
        ...eachItem,
        backdropPath: eachItem.backdrop_path,
        posterPath: eachItem.poster_path,
      }))
      this.setState({
        trendingMovies: formattedTrending,
        trendingStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({trendingStatus: apiStatusConstants.failure})
    }
  }

  getOriginalApiCall = async () => {
    this.setState({originalStatus: apiStatusConstants.inProgress})
    const originalUrl = 'https://apis.ccbp.in/movies-app/originals'
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
      const formattedTrending = data.results.map(eachItem => ({
        ...eachItem,
        backdropPath: eachItem.backdrop_path,
        posterPath: eachItem.poster_path,
      }))

      this.setState({
        originalMovies: formattedTrending,
        originalStatus: apiStatusConstants.success,
        topView:
          formattedTrending[
            Math.floor(Math.random() * formattedTrending.length)
          ],
      })
    } else {
      this.setState({originalStatus: apiStatusConstants.failure})
    }
  }

  renderCasesForTrending = () => {
    const {trendingStatus} = this.state
    switch (trendingStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderTrendingFailureView()
      case apiStatusConstants.success:
        return this.renderTrendingSuccess()
      default:
        return null
    }
  }

  renderTrendingFailureView = () => (
    <div className="failure-div">
      <img
        className="failure-img"
        src="https://res.cloudinary.com/dksp7vfwl/image/upload/v1701673093/Movies%20App/alert-triangle_tlkqhw.png"
        alt="failure view"
      />
      <p className="top-para">Something went wrong. Please try again</p>
      <button className="play-btn" type="button" onClick={this.retryTrending}>
        Try Again
      </button>
    </div>
  )

  renderTrendingSuccess = () => {
    const {trendingMovies} = this.state
    return <SliderView renderingList={trendingMovies} />
  }

  renderOriginalSuccess = () => {
    const {originalMovies} = this.state
    return <SliderView renderingList={originalMovies} />
  }

  renderCasesForOriginal = () => {
    const {originalStatus} = this.state
    switch (originalStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderOriginalSuccess()
      default:
        return null
    }
  }

  renderCasesForTop = () => {
    const {originalStatus} = this.state
    switch (originalStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderTopSuccess()
      default:
        return null
    }
  }

  renderTopSuccess = () => {
    const {topView} = this.state
    return (
      <div
        className="top-div"
        style={{backgroundImage: `url(${topView.backdropPath})`}}
      >
        <Header />
        <div className="poster-div">
          <h1 className="top-head">{topView.title}</h1>
          <p className="top-para">{topView.overview}</p>
          <button className="play-btn" type="button">
            Play
          </button>
        </div>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="failure-div">
      <LoadingView />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-div">
      <img
        className="failure-img"
        src="https://res.cloudinary.com/dksp7vfwl/image/upload/v1701673093/Movies%20App/alert-triangle_tlkqhw.png"
        alt="failure view"
      />
      <p className="top-para">Something went wrong. Please try again</p>
      <button className="play-btn" type="button" onClick={this.retry}>
        Try Again
      </button>
    </div>
  )

  render() {
    return (
      <>
        {this.renderCasesForTop()}
        <div className="down-div">
          <h1 className="down-head">Trending Now</h1>
          {this.renderCasesForTrending()}
          <h1 className="down-head">Originals</h1>
          {this.renderCasesForOriginal()}
        </div>
        <Footer />
      </>
    )
  }
}
export default Home
