import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import VideoSidePage from './Section/VideoSidePage';
import Subscribe from './Section/Subscribe';

const VideoDetailPage = props => {
  const [videoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    const videoId = props.match.params.videoId;
    const variable = {
      videoId,
    };
    Axios.post('/api/video/getVideoDetail', variable).then(response => {
      if (response.data.success) {
        console.log(response.data);
        setVideoDetail(response.data.videoDetail);
      } else {
        alert('비디오 가져오기 실패');
      }
    });
    return () => {};
  }, []);

  if (videoDetail.writer) {
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div
            style={{
              width: '100%',
              padding: '3rem 4rem',
            }}
          >
            <video
              style={{}}
              src={`http://localhost:5000/${videoDetail.filePath}`}
              controls
            ></video>
            <List.Item
              actions={[
                <Subscribe
                  userTo={videoDetail.writer._id}
                  userFrom={localStorage.getItem('userId')}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: 'purple',
                      verticalAlign: 'middle',
                    }}
                    size='large'
                  >
                    {videoDetail.writer.name[0]}
                  </Avatar>
                }
                title={videoDetail.title}
                description={videoDetail.description}
              />
            </List.Item>
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <VideoSidePage />
        </Col>
      </Row>
    );
  } else {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '80%',
          height: '100vh',
        }}
      >
        <h1>Loading....😂</h1>
      </div>
    );
  }
};

export default VideoDetailPage;
