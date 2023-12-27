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
class SearchResult extends Component {
  state = {
    searchInput: '',
    allVideosList: [],
    getVideosStatus: apiStatusConstants.initial,
  }

  getSearchVideosApiCall = async () => {
    this.setState({getVideosStatus: apiStatusConstants.inProgress})
    const {searchInput} = this.state
    const searchApiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
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
  }

  onClickSearchIcon = () => {
    this.getSearchVideosApiCall()
  }

  searchInputEvent = value => {
    this.setState({searchInput: value})
  }

  retry = () => {
    this.getSearchVideosApiCall()
  }

  renderCasesForVideos = () => {
    const {getVideosStatus, allVideosList} = this.state
    switch (getVideosStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        if (allVideosList.length === 0) {
          return this.renderNoVideosView()
        }
        return this.renderSuccessView()
      default:
        return null
    }
  }

  renderLoaderView = () => <LoadingView />

  renderFailureView = () => <FailureView onRetry={this.retry} />

  renderNoVideosView = () => {
    const {searchInput} = this.state
    return (
      <div className="search-ContentDiv">
        <img
          className="no-VideoImg"
          src="https://res.cloudinary.com/dksp7vfwl/image/upload/v1701673203/Movies%20App/Group_7394_vad2dr.png"
          alt="no movies"
        />
        <p className="initial-SearchPara">
          Your search for {searchInput} did not find any matches.
        </p>
      </div>
    )
  }

  renderSuccessView = () => {
    const {allVideosList} = this.state
    return (
      <ul className="search-result-Ul">
        {allVideosList.map(eachItem => (
          <li className="result-list-item" key={eachItem.id}>
            <Link to={`/movies/${eachItem.id}`}>
              <img
                className="thumbnail-img"
                src={eachItem.posterPath}
                alt={eachItem.title}
              />
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="search-div">
        <Header
          searchInputEvent={this.searchInputEvent}
          onClickSearchIcon={this.onClickSearchIcon}
        />

        {searchInput === '' ? (
          <div className="search-ContentDiv">
            <p className="initial-SearchPara">
              Search the movie,by clicking on the search Icon
            </p>
          </div>
        ) : (
          this.renderCasesForVideos()
        )}

        {/* {searchInput === '' && <Footer />} */}
        <Footer />
      </div>
    )
  }
}
export default SearchResult
