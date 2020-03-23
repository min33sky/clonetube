import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';
import VideoSidePage from './Section/VideoSidePage';
import Subscribe from './Section/Subscribe';
import Comment from './Section/Comment';
import LikeDislikes from './Section/LikeDislikes';

const VideoDetailPage = props => {
  const videoId = props.match.params.videoId;
  const [Video, setVideo] = useState([]);
  const [CommentLists, setCommentLists] = useState([]);

  const videoVariable = {
    videoId: videoId,
  };

  useEffect(() => {
    axios.post('/api/video/getVideoDetail', videoVariable).then(response => {
      if (response.data.success) {
        console.log(response.data.videoDetail);
        setVideo(response.data.videoDetail);
      } else {
        alert('Failed to get video Info');
      }
    });

    axios.post('/api/comment/getComments', videoVariable).then(response => {
      if (response.data.success) {
        console.log('response.data.comments', response.data.comments);
        setCommentLists(response.data.comments);
      } else {
        alert('Failed to get video Info');
      }
    });
  }, []);

  // 댓글 작성 시 업데이트
  const updateComment = newComment => {
    setCommentLists(CommentLists.concat(newComment));
  };

  // 서버에서 응답이 오면 랜더링
  if (Video.writer) {
    const SubscribeButton = Video.writer._id !==
      localStorage.getItem('userId') && (
      <Subscribe
        userTo={Video.writer._id}
        userFrom={localStorage.getItem('userId')}
      />
    );

    return (
      <Row>
        <Col lg={18} xs={24}>
          <div
            className='postPage'
            style={{ width: '100%', padding: '3rem 4em' }}
          >
            <video
              style={{ width: '100%' }}
              src={`http://localhost:5000/${Video.filePath}`}
              controls
            ></video>

            <List.Item
              actions={[
                <LikeDislikes
                  userId={localStorage.getItem('userId')}
                  videoId={videoId}
                />,
                SubscribeButton,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={Video.writer && Video.writer.image} />}
                title={<a href='https://ant.design'>{Video.title}</a>}
                description={Video.description}
              />
              <div></div>
            </List.Item>

            <Comment
              commentLists={CommentLists}
              postId={Video._id}
              refreshFunction={updateComment}
              {...props}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <VideoSidePage />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default VideoDetailPage;
