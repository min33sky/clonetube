import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

const VideoSidePage = () => {
  const [sideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    Axios.get('/api/video/getVideos')
      .then(response => {
        if (response.data.success) {
          setSideVideos(response.data.videos);
        } else {
          alert('비디오 가져오기를 실패했습니다.');
        }
      })
      .catch(e => {
        console.log('실패: ', e);
        alert('비디오 로드 실패');
      });
    return () => {};
  }, []);

  const renderSideVideos = sideVideos.map((video, idx) => {
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={idx}
        style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }}
      >
        <div style={{ width: '40%', marginRight: '1rem' }}>
          <Link to=''>
            <img
              style={{ width: '100%', height: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt='썸네일'
            />
          </Link>
        </div>
        <div style={{ width: '50%' }}>
          <Link to='' style={{ color: 'gray' }}>
            <span style={{ fontSize: '1rem', color: 'black' }}>
              {video.title}
            </span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views} view</span>
            <br />
            <span>
              {minutes} : {seconds}{' '}
            </span>
          </Link>
        </div>
      </div>
    );
  });

  return (
    <>
      <div style={{ marginTop: '3rem' }} />
      {renderSideVideos}
    </>
  );
};

export default VideoSidePage;
