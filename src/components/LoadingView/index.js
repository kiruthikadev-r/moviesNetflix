import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const LoadingView = () => (
  <div className="loader-container" testid="loader">
    <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
  </div>
)
export default LoadingView
