import Slider from 'react-slick'
import {Link, withRouter} from 'react-router-dom'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'

const SliderView = props => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  }
  const {renderingList} = props
  console.log(renderingList)
  return (
    <Slider {...settings}>
      {renderingList.map(eachItem => (
        <li className="slide-Item" key={eachItem.id} testid="MovieCard">
          <Link to={`/movies/${eachItem.id}`}>
            <img
              className="slide-Img"
              src={eachItem.posterPath}
              alt={eachItem.title}
            />
          </Link>
        </li>
      ))}
    </Slider>
  )
}
export default withRouter(SliderView)
