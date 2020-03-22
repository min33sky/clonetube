import React, { useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const Comment = props => {
  const [comment, setComment] = useState('');
  const { userData } = useSelector(state => state.user);

  const handleChange = e => {
    setComment(e.currentTarget.value);
  };

  const onSubmit = e => {
    e.preventDefault();
    // 글번호, 내 아이디, 내용 전달

    Axios.post('/api/comment/saveComment', {
      content: comment,
      writer: userData._id,
      postId: props.match.params.videoId,
    }).then(response => {
      if (response.data.success) {
        console.log(response.data);
        setComment('');
        props.refreshFunction(response.data.result);
      } else {
        alert('댓글 로딩 실패');
      }
    });
  };

  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />
      {/* comment List */}

      {/* 답글을 제외하고 댓글만 출력한다. */}
      {props.commentLists &&
        props.commentLists.map(
          (comment, idx) =>
            !comment.responseTo && (
              <div key={idx}>
                <SingleComment
                  comment={comment}
                  postId={props.postId}
                  refreshFunction={props.refreshFunction}
                />
                <ReplyComment
                  commentLists={props.commentLists}
                  postId={props.postId}
                  parentCommentId={comment._id}
                  refreshFunction={props.refreshFunction}
                />
              </div>
            ),
        )}

      {/* Root Comment Form */}

      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleChange}
          value={comment}
          placeholder='댓글을 작성해 주세요'
        />
        <br />
        <button style={{ width: '20%', height: '52px' }}>Submit</button>
      </form>
    </div>
  );
};

export default Comment;
