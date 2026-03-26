import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from './Image';
import allImages from '../constants/images';

const INITIAL_BATCH = 10;
const BATCH_SIZE = 6;
const LOAD_DELAY_MS = 500;
// Example backend endpoint if/when API is introduced:
// const API_ENDPOINT = 'https://your-domain.com/api/images';

export default function Images() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef(null);
  const isLoadingRef = useRef(false);
  const hasMore = visibleCount < allImages.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);

    // Simulate async fetching from a local dataset.
    window.setTimeout(() => {
      setVisibleCount(current => Math.min(current + BATCH_SIZE, allImages.length));
      setIsLoading(false);
      isLoadingRef.current = false;
    }, LOAD_DELAY_MS);

    /*
    API version of loadMore (keep this for future switch):
    ------------------------------------------------------
    const loadMore = useCallback(async () => {
      if (!hasMore || isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        // Example query params: offset + limit for pagination
        const offset = visibleCount;
        const res = await fetch(`${API_ENDPOINT}?offset=${offset}&limit=${BATCH_SIZE}`);
        const nextImages = await res.json();

        // If API returns no more items, stop infinite loading
        if (!nextImages.length) {
          // setHasMore(false); // if you convert hasMore into state
        } else {
          // setImages(prev => [...prev, ...nextImages]); // if images come from API
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    }, [visibleCount, hasMore]);
    */
  }, [hasMore]);

  /*
  API migration notes:
  1) Replace local `allImages` usage with component state:
     const [images, setImages] = useState([]);
     const [hasMore, setHasMore] = useState(true);
  2) Call loadMore() once on mount to fetch the first page.
  3) Render `images.map(...)` instead of `allImages.slice(...)`.
  */

  useEffect(() => {
    if (!sentinelRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { root: null, rootMargin: '150px 0px', threshold: 0.01 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className='images-grid'>
        {allImages.slice(0, visibleCount).map(image => (
          <Image key={image.id} image={image} />
        ))}
      </div>
      {isLoading && <p className='status'>Loading more images...</p>}
      {!hasMore && <p className='status done'>All images loaded.</p>}
      <div ref={sentinelRef} className='sentinel' aria-hidden='true' />
    </>
  );
}
