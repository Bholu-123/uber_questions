import './slider.css'

const Slide = ({ image_url, caption, active }) => {
  return (
    <div className={`slide ${active ? 'active' : ''}`}>
      <img src={image_url} alt={caption} />
      <span>{caption}</span>
    </div>
  )
}

const Slider = ({ images, active, setActive }) => {
  const onNext = () => {
    if (active < images.length - 1) {
      setActive(active + 1)
    }
  }

  const onPrev = () => {
    if (active > 0) {
      setActive(active - 1)
    }
  }

  return (
    <div className="slider">
      <div className="slides">
        {images.map((image, index) => (
          <Slide key={image.caption} {...image} active={index === active} />
        ))}
      </div>
      <div className="navigation">
        <div className="navigation-next-prev">
          <div className="next-prev prev" onClick={onPrev}>
            &lt;
          </div>
          <div className="next-prev next" onClick={onNext}>
            &gt;
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slider
