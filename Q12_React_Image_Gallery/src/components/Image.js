import React, { useState } from 'react';

export default function Image({ image }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <article className='image-card'>
      {!loaded && <div className='image-skeleton' />}
      <img
        className={`single-photo ${loaded ? 'loaded' : ''}`}
        src={image.src}
        alt={image.alt}
        loading='lazy'
        onLoad={() => setLoaded(true)}
      />
    </article>
  );
}
