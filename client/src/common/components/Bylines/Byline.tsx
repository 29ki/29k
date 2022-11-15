import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import Image from '../Image/Image';
import {Spacer4} from '../Spacers/Spacer';
import {Body14} from '../Typography/Body/Body';

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
});

const ImageContainer = styled.View({
  backgroundColor: COLORS.GREYMEDIUM,
  width: SPACINGS.TWENTYFOUR,
  height: SPACINGS.TWENTYFOUR,
  borderRadius: SPACINGS.TWELVE,
  overflow: 'hidden',
  shadowColor: COLORS.GREYDARK,
});

type BylineProps = {
  pictureURL?: string;
  name?: string;
};

const Byline: React.FC<BylineProps> = ({pictureURL, name}) => {
  const {t} = useTranslation('Component.Byline');
  if (!pictureURL && !name) {
    return null;
  }

  return (
    <Container>
      <ImageContainer>
        {pictureURL && <Image source={{uri: pictureURL}} />}
      </ImageContainer>
      <Spacer4 />
      <Body14>
        {t('with')} {name}
      </Body14>
    </Container>
  );
};

export default Byline;
