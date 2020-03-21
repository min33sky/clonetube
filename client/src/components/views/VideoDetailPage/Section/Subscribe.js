import React, { useEffect, useState } from 'react';
import Axios from 'axios';

/**
 *
 * @param {*} userTo 게시물 업로드한 사람
 * @param {*} userFrom 로그인 한 사용자
 */
const Subscribe = ({ userTo, userFrom }) => {
  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const variable = {
      userTo,
    };

    // 해당 글쓴이의 구독자수 가져오기
    Axios.post('/api/subscribe/subscribeNumber', variable).then(response => {
      if (response.data.success) {
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert('구독자 수 정보를 받아오지 못했습니다.');
      }
    });

    const subscribedVariable = {
      userTo,
      userFrom: localStorage.getItem('userId'), // 로컬스토리지에 로그인 한 유저의 아이디가 저장
    };

    // 내가 이 사람에 구독 했는지 정보를 가져오기
    Axios.post('/api/subscribe/subcribed', subscribedVariable).then(
      response => {
        if (response.data.success) {
          // 성공
          setSubscribed(response.data.subscribed);
        } else {
          alert('정보 받아오기 실패');
        }
      },
    );
  }, []);

  // 구독 버튼
  const onSubscribe = () => {
    if (subscribed) {
      // 구독중이라면 취소
      Axios.post('/api/subscribe/unsubscibe', {
        userTo,
        userFrom,
      }).then(response => {
        if (response.data.success) {
          // 구독 취소 성공
          setSubscribeNumber(subscribeNumber - 1);
          setSubscribed(!subscribed);
        } else {
          alert('구독 취소 실패');
        }
      });
    } else {
      // 비구독이면 구독
      Axios.post('/api/subscribe/subscribe', {
        userTo,
        userFrom,
      })
        .then(response => {
          if (response.data.success) {
            // 구독  성공
            setSubscribeNumber(subscribeNumber + 1);
            setSubscribed(!subscribed);
          } else {
            alert('구독 실패');
          }
        })
        .catch(err => {
          alert('구도크 실패요 ');
          console.log(err.response);
        });
    }
  };

  if (userTo !== userFrom) {
    return (
      <div>
        <button
          style={{
            backgroundColor: `${subscribed ? '#AAAAAA' : '#CC0000'}`,
            borderRadius: '4px',
            color: 'white',
            padding: '10px 16px',
            fontWeight: '500',
            fontSize: '1rem',
            textTransform: 'uppercase',
          }}
          onClick={onSubscribe}
        >
          {subscribeNumber} {subscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>
    );
  } else {
    return '';
  }
};

export default Subscribe;
