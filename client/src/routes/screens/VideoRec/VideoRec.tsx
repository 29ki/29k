import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {Camera, CameraType} from 'expo-camera';
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
  const [, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const [isRecording, setIsRecording] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewVideo, setPreviewVideo] = useState('');

  return (
    <>
      {!showPreview && (
        <Camera type={CameraType.front} style={StyleSheet.absoluteFill} />
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
                onPress={async () => {
                  setIsRecording(true);
                  cameraRef.current
                    ?.recordAsync()
                    .then(recording => {
                      console.log('>>>> ', recording);
                      if (recording) {
                        setPreviewVideo(recording.uri);
                      }
                    })
                    .catch(err => {
                      console.log('>>> ERROR', err);
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
