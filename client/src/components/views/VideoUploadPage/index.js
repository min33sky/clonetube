import React, { useState } from 'react';
import DropZone from 'react-dropzone';
import Title from 'antd/lib/typography/Title';
import { Form, Input, Button, Icon } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios';
import { SERVER_URL } from '../../..';

const privateOptions = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' },
];

const categoryOptions = [
  { value: 0, label: 'Film & Animation' },
  { value: 1, label: 'Autos & Vehicles' },
  { value: 2, label: 'Music' },
  { value: 3, label: 'Pets & Animals' },
];

const VideoUploadPage = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privateContent, setPrivateContent] = useState(null);
  const [category, setCategory] = useState('Film & Animation');
  const [videoFilePath, setVideoFilePath] = useState('');
  const [thumbnailPath, setThumbnailPath] = useState('');
  const [duration, setDuration] = useState('');

  const onTitleHandelr = e => {
    setVideoTitle(e.currentTarget.value);
  };

  const onDescriptionHandler = e => {
    setDescription(e.currentTarget.value);
  };

  const onCategoryHandler = e => {
    setCategory(e.currentTarget.value);
  };
  const onPrivateHandler = e => {
    setPrivateContent(e.currentTarget.value);
  };

  const onDrop = files => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);

    console.log(files);

    Axios.post('/api/video/uploadfiles', formData, config).then(response => {
      console.log('응답 : ', response.data.success);
      if (response.data.success) {
        // 성공
        console.log(response.data);

        let variable = {
          filePath: response.data.filePath, // 서버에 저장된 파일 주소
          fileName: response.data.fileName, // 서버에 저장된 파일 이름
        };

        setVideoFilePath(response.data.filePath);

        // 썸네일 요청하기
        Axios.post('/api/video/thumbnail', variable).then(response => {
          if (response.data.success) {
            console.log(response.data);
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.thumbsFilePath);
          } else if (response.data.success === false) {
            alert('썸네일 생성 실패..');
          }
        });
      } else {
        console.log('동영상 업로드 실패');
        alert(response.data.message);
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Drop Zone */}
          <DropZone onDrop={onDrop} multiple={false} maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: '300px',
                  height: '240px',
                  border: '1px solid lightgray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type='plus' style={{ fontSize: '3rem' }} />
              </div>
            )}
          </DropZone>

          {/* Thumbnail */}
          {thumbnailPath && (
            <div>
              <img src={`${SERVER_URL}/${thumbnailPath}`} alt='thumbnail' />
            </div>
          )}
        </div>

        <br />
        <br />
        <label>Title</label>
        <Input value={videoTitle} onChange={onTitleHandelr} />
        <br />
        <br />
        <label>Description</label>
        <TextArea value={description} onChange={onDescriptionHandler} />
        <br />
        <br />
        <select onChange={onPrivateHandler}>
          {privateOptions.map((item, idx) => (
            <option key={idx} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryHandler}>
          {categoryOptions.map((item, idx) => (
            <option key={idx} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />

        <Button type='primary' size='large'>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default VideoUploadPage;
