import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ScrollView} from 'react-native';
import Video from 'react-native-video';
import {SharedElement} from 'react-navigation-shared-element';
import styled from 'styled-components/native';
import Gutters from '../../common/components/Gutters/Gutters';
import Screen from '../../common/components/Screen/Screen';
import {Body16} from '../../common/components/Typography/Body/Body';
import {Display36} from '../../common/components/Typography/Display/Display';

const StyledVideo = styled(Video).attrs({
  resizeMode: 'cover',
})({
  width: '100%',
  aspectRatio: 1,
});

const AboutOverlay = () => {
  const {goBack} = useNavigation();
  return (
    <Screen onPressBack={goBack}>
      <ScrollView>
        <SharedElement id="editorial.image">
          <StyledVideo
            source={{
              uri: 'https://res.cloudinary.com/cupcake-29k/video/upload/v1671006405/Temp/20221201115453_tphsjc.mp4',
            }}
            poster="https://res.cloudinary.com/cupcake-29k/image/upload/v1671006827/Temp/poster_xzyxoq.jpg"
            posterResizeMode="cover"
            repeat
          />
        </SharedElement>
        <Gutters>
          <SharedElement id="editorial.heading">
            <Display36>Transitions effects</Display36>
          </SharedElement>
          <SharedElement id="editorial.text">
            <Body16>
              If however the start- element and end elements are visually
              different, then it can make sense to choose different values. For
              instance, if you are transitioning from a with a white color to a
              with a black color, then using animation="fade" will create a
              cross-fade between them. If however the start- element and end
              elements are visually different, then it can make sense to choose
              different values. For instance, if you are transitioning from a
              with a white color to a with a black color, then using
              animation="fade" will create a cross-fade between them. If however
              the start- element and end elements are visually different, then
              it can make sense to choose different values. For instance, if you
              are transitioning from a with a white color to a with a black
              color, then using animation="fade" will create a cross-fade
              between them. If however the start- element and end elements are
              visually different, then it can make sense to choose different
              values. For instance, if you are transitioning from a with a white
              color to a with a black color, then using animation="fade" will
              create a cross-fade between them. If however the start- element
              and end elements are visually different, then it can make sense to
              choose different values. For instance, if you are transitioning
              from a with a white color to a with a black color, then using
              animation="fade" will create a cross-fade between them. If however
              the start- element and end elements are visually different, then
              it can make sense to choose different values. For instance, if you
              are transitioning from a with a white color to a with a black
              color, then using animation="fade" will create a cross-fade
              between them. If however the start- element and end elements are
              visually different, then it can make sense to choose different
              values. For instance, if you are transitioning from a with a white
              color to a with a black color, then using animation="fade" will
              create a cross-fade between them. If however the start- element
              and end elements are visually different, then it can make sense to
              choose different values. For instance, if you are transitioning
              from a with a white color to a with a black color, then using
              animation="fade" will create a cross-fade between them. If however
              the start- element and end elements are visually different, then
              it can make sense to choose different values. For instance, if you
              are transitioning from a with a white color to a with a black
              color, then using animation="fade" will create a cross-fade
              between them. If however the start- element and end elements are
              visually different, then it can make sense to choose different
              values. For instance, if you are transitioning from a with a white
              color to a with a black color, then using animation="fade" will
              create a cross-fade between them. If however the start- element
              and end elements are visually different, then it can make sense to
              choose different values. For instance, if you are transitioning
              from a with a white color to a with a black color, then using
              animation="fade" will create a cross-fade between them.
            </Body16>
          </SharedElement>
        </Gutters>
      </ScrollView>
    </Screen>
  );
};

export default AboutOverlay;
