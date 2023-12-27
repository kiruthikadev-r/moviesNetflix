import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="footer-div">
    <div className="btns-div">
      <button className="icon-btn" type="button">
        <FaGoogle fill="white" />
      </button>
      <button className="icon-btn" type="button">
        <FaTwitter fill="white" />
      </button>
      <button className="icon-btn" type="button">
        <FaInstagram fill="white" />
      </button>
      <button className="icon-btn" type="button">
        <FaYoutube fill="white" />
      </button>
    </div>
    <p className="contact-us">Contact us</p>
  </div>
)
export default Footer
