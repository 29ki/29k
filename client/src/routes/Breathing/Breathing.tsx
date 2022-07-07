import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import RNVideo from 'react-native-video';
import styled from 'styled-components/native';
import Gutters from '../../common/components/Gutters/Gutters';
import {BackIcon} from '../../common/components/Icons';
import {TopSafeArea} from '../../common/components/Spacers/Spacer';

const Video = styled(RNVideo)({
  ...StyleSheet.absoluteFillObject,
  flex: 1,
  width: '100%',
  height: '100%',
});

const Audio = styled(RNVideo)({});

const Back = styled.TouchableOpacity({
  width: 40,
  height: 40,
});

const Breathing = () => {
  const {goBack} = useNavigation();
  return (
    <>
      <Video
        source={{
          uri: 'https://res.cloudinary.com/twentyninek/video/upload/v1657186014/temp/breathe_bubble_mxjjaz.mp4',
        }}
        resizeMode="cover"
        repeat
      />
      <Audio
        source={{
          uri: 'https://res.cloudinary.com/twentyninek/video/upload/v1657186772/temp/583998__stanrams__meditation-one_nynthl.mp3',
        }}
        ignoreSilentSwitch="ignore"
        audioOnly
      />
      <TopSafeArea />
      <Gutters>
        <Back onPress={goBack}>
          <BackIcon />
        </Back>
      </Gutters>
    </>
  );
};

export default Breathing;
