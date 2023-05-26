import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import styled from 'styled-components/native';
import Video from 'react-native-video';

import Button from '../../../lib/components/Buttons/Button';

const ButtonsWrapper = styled.View({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
});

const VideoRec = () => {
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    Camera.getCameraPermissionStatus();
    Camera.getMicrophonePermissionStatus();
  }, []);

  const devices = useCameraDevices();
  const device = devices.front;
  const [isRecording, setIsRecording] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewVideo, setPreviewVideo] = useState('');

  return (
    <>
      {Boolean(device) && !showPreview && (
        <Camera
          ref={cameraRef}
          device={device}
          video={true}
          audio={true}
          style={StyleSheet.absoluteFill}
          isActive={true}
        />
      )}
      {showPreview && previewVideo && (
        <Video
          source={{uri: previewVideo}}
          repeat={true}
          style={StyleSheet.absoluteFill}
        />
      )}
      <ButtonsWrapper>
        {!showPreview && (
          <>
            {!isRecording && (
              <Button
                onPress={() => {
                  setIsRecording(true);
                  cameraRef.current?.startRecording({
                    onRecordingFinished: video => setPreviewVideo(video.path),
                    onRecordingError: error => console.error(error),
                  });
                }}>
                {'Record'}
              </Button>
            )}
            {isRecording && (
              <Button
                onPress={() => {
                  setIsRecording(false);
                  setShowPreview(true);
                  cameraRef.current?.stopRecording();
                }}>
                {'Done'}
              </Button>
            )}
          </>
        )}
        {showPreview && (
          <Button onPress={() => setShowPreview(false)}>{'Great'}</Button>
        )}
      </ButtonsWrapper>
    </>
  );
};

export default VideoRec;
