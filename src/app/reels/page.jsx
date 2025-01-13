
  'use client';
  import React, { useEffect, useState } from 'react';
  import ReelsVideo from '@/components/reels/video';
  import { useReelsStore } from '@/store/pages/reels/useReelsStore';
  import { Skeleton, TextField } from '@mui/material';
  import Link from 'next/link';

  const Reels = () => {
    const [activeVideo, setActiveVideo] = useState(null);
    const { reels, GetReels } = useReelsStore();

    useEffect(() => {
      GetReels();
    }, []);

  
    useEffect(() => {
      const handleVisibilityChange = (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.dataset.id;
          if (entry.isIntersecting) {
            setActiveVideo(videoId);
          }
        });
      };

      const observer = new IntersectionObserver(handleVisibilityChange, {
        threshold: 0.7,
      });

      const videoContainers = document.querySelectorAll('.video-container');
      videoContainers.forEach((container) => observer.observe(container));

      return () => observer.disconnect();
    }, [reels]);

    return (
      <div className='h-screen overflow-auto'>
        <title>Reels</title>
        {reels.length > 0 ? (
          reels.map((el) => (
            <div
              key={el.postId}
              data-id={el.postId}
              className="video-container mb-[30px]"
            >
              <ReelsVideo
                post={el}
                onVideoPlay={() => setActiveVideo(el.postId)}
                isActive={activeVideo === el.postId}
              />
            </div>
          ))
        ) : (
        
          <div className="max-w-[370px] m-auto mt-[40px]">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="mb-[30px]">
                <Skeleton variant="rectangular" width="100%" height="300px" />
                <Skeleton variant="text" width="80%" height="40px" sx={{ marginTop: '10px' }} />
                <Skeleton variant="text" width="60%" height="40px" sx={{ marginTop: '5px' }} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  export default Reels;