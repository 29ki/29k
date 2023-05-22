import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {Spacer4} from '../Spacers/Spacer';
import {Body12, Body14} from '../Typography/Body/Body';
import ProfilePicture from '../User/ProfilePicture';

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  alignSelf: 'flex-start',
});

const WrapText = styled(Body14)({flexShrink: 0});
const WrapTextSmall = styled(Body12)({flexShrink: 0});

const ImageContainer = styled.View<{small?: boolean}>(({small}) => ({
  backgroundColor: COLORS.GREYMEDIUM,
  width: small ? SPACINGS.SIXTEEN : SPACINGS.TWENTYFOUR,
  height: small ? SPACINGS.SIXTEEN : SPACINGS.TWENTYFOUR,
  borderRadius: SPACINGS.TWELVE,
  overflow: 'hidden',
  shadowColor: COLORS.GREYDARK,
}));

type BylineProps = {
  pictureURL?: string;
  name?: string;
  duration?: number;
  small?: boolean;
};

const Byline: React.FC<BylineProps> = React.memo(
  ({pictureURL, name, duration, small}) => {
    const {t} = useTranslation('Component.Byline');
    if (!pictureURL && !name) {
      return null;
    }

    return (
      <Container>
        <ImageContainer small={small}>
          <ProfilePicture
            size={small ? SPACINGS.SIXTEEN : SPACINGS.TWENTYFOUR}
            pictureURL={pictureURL}
            letter={name?.[0]}
          />
        </ImageContainer>
        <Spacer4 />
        {small ? (
          <WrapTextSmall numberOfLines={1}>
            {`${t('with')} ${name}`}
          </WrapTextSmall>
        ) : (
          <WrapText numberOfLines={2}>
            {t('with')} {name}{' '}
            {duration ? `· ${duration} ${t('minutesAbbreviation')}` : ''}
          </WrapText>
        )}
      </Container>
    );
  },
);

export default Byline;
