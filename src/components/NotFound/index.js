import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-Found-Container">
    <h1 className="not-FoundTitle">Lost your way?</h1>
    <p className="not-FoundDescription">
      we are sorry, the page you requested could not be found Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button className="goto-HomeBtn" type="button">
        Go to Home
      </button>
    </Link>
  </div>
)

export default NotFound
