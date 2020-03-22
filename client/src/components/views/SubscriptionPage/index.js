import React, { useEffect, useState } from 'react';
import Title from 'antd/lib/typography/Title';
import { Row, Col, Avatar } from 'antd';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Meta from 'antd/lib/card/Meta';
import moment from 'moment';

function SubscriptionPage() {
  const [video, setVideo] = useState([]);

  useEffect(() => {
    Axios.post('/api/video/getSubscriptionVideos', {
      userFrom: localStorage.getItem('userId'),
    })
      .then(response => {
        if (response.data.success) {
          setVideo(response.data.videos);
        } else {
          alert('비디오 가져오기를 실패했습니다.');
        }
      })
      .catch(e => {
        alert('비디오 로드 실패');
      });
  }, []);

  const renderCards = video.map((v, idx) => {
    const minutes = Math.floor(v.duration / 60);
    const seconds = Math.floor(v.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24}>
        <div key={idx} style={{ position: 'relative' }}>
          <Link to={`/video/${v._id}`}>
            <img
              style={{ width: '100%' }}
              src={`http://localhost:5000/${v.thumbnail}`}
            />
            <div className='duration'>
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </Link>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={v.writer.image} />}
          title={v.title}
          description=''
        />
        <span>{v.writer.name}</span>
        <br />
        <span style={{ marginLeft: '3rem' }}>{v.views} views - </span>
        <span>{moment(v.createdAt).format('MMM Do YY')}</span>
      </Col>
    );
  });

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2}>Subscription Video</Title>
      <hr />
      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

export default SubscriptionPage;
