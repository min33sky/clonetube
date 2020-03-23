import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

const LikeDislikes = props => {
  const [likes, setLikes] = useState(0);
  const [likeAction, setLikeAction] = useState(false);
  const [dislikes, setDislikes] = useState(0);
  const [dislikeAction, setDislikeAction] = useState(false);

  let variable = {};

  if (props.video) {
    variable = {
      videoId: props.videoId,
      userId: props.userId,
    };
  } else {
    variable = {
      commentId: props.commentId,
      userId: props.userId,
    };
  }

  useEffect(() => {
    Axios.post('/api/like/getLikes', variable).then(response => {
      if (response.data.success) {
        console.log('좋아요 갖고오기 성공');
        // 좋아요 수 저장
        setLikes(response.data.likes.length);
        // 내가 좋아요를 눌렀는지 확인

        response.data.likes.map((like, idx) => {
          if (like.userId === props.userId) {
            // 내가 좋아요를 누름
            setLikeAction(true);
          }
        });
      } else {
        alert('좋아요 불러오기 실패');
      }
    });

    Axios.post('/api/like/getDislikes', variable).then(response => {
      if (response.data.success) {
        console.log('싫어요 갖고오기 성공');
        setDislikes(response.data.dislikes.length);

        response.data.dislikes.map((dislike, idx) => {
          if (dislike.userId === props.userId) {
            setDislikeAction(true);
          }
        });
      } else {
        alert('싫어요 불러오기 실패');
      }
    });
  }, []);

  const onLike = () => {
    if (!likeAction) {
      Axios.post('/api/like/upLike', variable).then(response => {
        if (response.data.success) {
          // 좋아요 성공
          setLikes(likes + 1);
          setLikeAction(true);

          // 싫어요가 눌러져 있었을 경우 취소한다.
          if (dislikes) {
            setDislikes(dislikes - 1);
            setDislikeAction(false);
          }
        } else {
          alert('좋아요 실패');
        }
      });
    } else {
      // 좋아요을 이미 눌렀을 땐 좋아요 취소하기
      Axios.post('/api/like/unLike', variable).then(response => {
        if (response.data.success) {
          // 좋아요 취소 성공
          setLikes(likes - 1);
          setLikeAction(false);
        } else {
          alert('좋아요 취소 실패');
        }
      });
    }
  };

  const onDislike = () => {
    if (!dislikeAction) {
      Axios.post('/api/like/upDislike', variable).then(response => {
        if (response.data.success) {
          setDislikes(dislikes + 1);
          setDislikeAction(true);

          if (likes) {
            setLikes(likes - 1);
            setLikeAction(false);
          }
        } else {
          alert('싫어요 실패');
        }
      });
    } else {
      // 좋아요을 이미 눌렀을 땐 좋아요 취소하기
      Axios.post('/api/like/unDislike', variable).then(response => {
        if (response.data.success) {
          setDislikes(dislikes - 1);
          setDislikeAction(false);
        } else {
          alert('싫어요 취소 실패');
        }
      });
    }
  };

  return (
    <div>
      <span key='comment-basic-like'>
        <Tooltip title='Like'>
          <Icon
            type='like'
            theme={likeAction ? 'filled' : 'outlined'}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {likes} </span>
      </span>
      <span key='comment-basic-dislike'>
        <Tooltip title='Disike'>
          <Icon
            type='dislike'
            theme={dislikeAction ? 'filled' : 'outlined'}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {dislikes} </span>
      </span>
    </div>
  );
};

export default LikeDislikes;
