import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const Account = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <>
      <Header />
      <div className="account-div">
        <h1 className="account-head">Account</h1>
        <hr className="horizontal-line" />
        <div className="details-div">
          <p className="main-label">Member ship</p>
          <div>
            <p className="mail">rahul@gmail.com</p>
            <p className="just-label">Password : ************</p>
          </div>
        </div>
        <hr className="horizontal-line" />
        <div className="details-div">
          <p className="main-label">Plan details</p>
          <div className="row-div">
            <p className="mail">Premium </p>
            <p className="ultra">Ultra HD</p>
          </div>
        </div>
        <hr className="horizontal-line" />
        <button className="logout-btn" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
      <Footer />
    </>
  )
}

export default Account
