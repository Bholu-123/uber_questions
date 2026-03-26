import { useState } from 'react'
import Modal from './components/Modal'
import Slider from './components/Slider'
import { images } from './constants/images'
import './App.css'

export default function App() {
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(0)

  const handleClick = (index) => {
    setActive(index)
    setShow(true)
  }

  const onClose = () => {
    setShow(false)
  }

  return (
    <div className="App">
      <Modal show={show} title="Lightbox" onClose={onClose}>
        <Slider images={images} active={active} setActive={setActive} />
      </Modal>

      <div className="image-list">
        {images.map((image, index) => (
          <div
            className={index === active ? 'active' : ''}
            onClick={() => handleClick(index)}
            key={image.caption}
          >
            <img src={image.image_url} alt={image.caption} />
          </div>
        ))}
      </div>
    </div>
  )
}
