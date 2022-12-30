import React from 'react';
import {StyleSheet, View} from 'react-native';
import styled from 'styled-components/native';
import Gutters from '../Gutters/Gutters';
import {ProfileIcon} from '../Icons';
import {Spacer16} from '../Spacers/Spacer';
import {Display36} from '../Typography/Display/Display';
import HeaderScrollView from './HeaderScrollView';

const HeaderWrapper = styled.View({
  alignItems: 'center',
});

const HeaderImage = styled.Image({
  ...StyleSheet.absoluteFillObject,
});

const Header = () => (
  <HeaderWrapper>
    <HeaderImage
      source={{
        uri: 'https://res.cloudinary.com/cupcake-29k/image/upload/v1671006827/Temp/poster_xzyxoq.jpg',
      }}
    />
    <ProfileIcon />
  </HeaderWrapper>
);

export const AllTypes = () => (
  <HeaderScrollView header={<Header />}>
    <Spacer16 />
    <Gutters>
      <Display36>Scroll me (on iOS)</Display36>
    </Gutters>
  </HeaderScrollView>
);

export const CustomAspectRatio = () => (
  <HeaderScrollView headerAspectRatio={1.9} header={<Header />}>
    <Spacer16 />
    <Gutters>
      <Display36>Scroll me (on iOS)</Display36>
    </Gutters>
  </HeaderScrollView>
);
