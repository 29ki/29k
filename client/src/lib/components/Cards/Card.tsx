import React, {Fragment, useMemo} from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import hexToRgba from 'hex-to-rgba';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import Image from '../Image/Image';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Display20} from '../Typography/Display/Display';
import Byline from '../Bylines/Byline';
import {Spacer4, Spacer8} from '../Spacers/Spacer';
import Tag from '../Tag/Tag';
import {BellFillIcon, CheckIcon} from '../Icons';
import {useTranslation} from 'react-i18next';
import {UserType} from '../../../../../shared/src/schemas/User';
import {ExerciseCard} from '../../../../../shared/src/types/generated/Exercise';

export const HEIGHT = 175;

const Wrapper = styled(TouchableOpacity)({
  borderRadius: 16,
  backgroundColor: COLORS.CREAM,
  height: HEIGHT,
  padding: 16,
  overflow: 'hidden',
});

const Graphic = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    width: 112,
    height: 112,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'flex-end',
    backgroundColor,
  }),
);

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
});

const Main = styled.View({
  flex: 1,
  justifyContent: 'space-between',
});

const Tags = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const PinnedTag = styled(Tag)({
  backgroundColor: COLORS.CREAM,
  color: COLORS.PRIMARY,
  paddingHorizontal: 0,
});

const InterestedTag = styled(Tag)({
  backgroundColor: COLORS.PRIMARY,
  color: COLORS.WHITE,
});

const TagsGradient = styled(LinearGradient)({
  position: 'absolute',
  right: -SPACINGS.SIXTEEN,
  bottom: 0,
  width: 30,
  height: 20,
});

const Title = styled(Display20)({
  textOverflow: 'ellipsis',
});

const Content = styled.View({
  alignItems: 'flex-end',
  flexDirection: 'row',
  flex: 1,
});

type CardProps = {
  title?: string;
  tags?: Array<string>;
  graphic?: ExerciseCard;
  onPress: () => void;
  children?: React.ReactNode;
  hostProfile?: UserType | null;
  isPinned?: boolean;
  reminderEnabled?: boolean;
  interestedCount?: number;
  style?: ViewStyle;
};

export const Card: React.FC<CardProps> = ({
  title,
  tags,
  graphic,
  onPress,
  hostProfile,
  children,
  isPinned,
  reminderEnabled,
  interestedCount,
  style,
}) => {
  const {t} = useTranslation('Component.Card');
  const colors = useMemo(
    () => [
      hexToRgba(COLORS.CREAM, 0),
      hexToRgba(COLORS.CREAM, 1),
      hexToRgba(COLORS.CREAM, 1),
    ],
    [],
  );

  const image = useMemo(
    () =>
      graphic?.image?.source
        ? {
            uri: graphic?.image?.source,
          }
        : undefined,
    [graphic?.image?.source],
  );

  const lottie = useMemo(
    () =>
      graphic?.lottie?.source
        ? {
            uri: graphic?.lottie?.source,
          }
        : undefined,
    [graphic?.lottie?.source],
  );

  return (
    <Wrapper onPress={onPress} style={style}>
      <Tags>
        {interestedCount ? (
          <>
            <PinnedTag>{t('interested')}</PinnedTag>
            <Spacer4 />
            <InterestedTag>{interestedCount}</InterestedTag>
            <Spacer4 />
          </>
        ) : (
          isPinned && (
            <>
              <PinnedTag
                LeftIcon={reminderEnabled ? BellFillIcon : CheckIcon}
                iconFill={COLORS.PRIMARY}>
                {t('myJourneyTag')}
              </PinnedTag>
              <Spacer4 />
            </>
          )
        )}
        {tags &&
          tags.map(tag => (
            <Fragment key={tag}>
              <Tag>{tag}</Tag>
              <Spacer4 />
            </Fragment>
          ))}
        <TagsGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={colors} />
      </Tags>
      <Spacer4 />
      <Row>
        <Main>
          <Title numberOfLines={2}>{title}</Title>
          <Spacer4 />
          {hostProfile && (
            <Byline
              pictureURL={hostProfile.photoURL}
              name={hostProfile.displayName}
            />
          )}
          <Content>{children}</Content>
        </Main>
        <Spacer8 />
        <Graphic backgroundColor={graphic?.backgroundColor}>
          {lottie ? (
            <Lottie source={lottie} autoPlay loop />
          ) : image ? (
            <Image resizeMode="contain" source={image} />
          ) : null}
        </Graphic>
      </Row>
    </Wrapper>
  );
};

export default Card;
