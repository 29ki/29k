import React, {Fragment} from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import hexToRgba from 'hex-to-rgba';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Display20} from '../Typography/Display/Display';
import Byline from '../Bylines/Byline';
import {Spacer4, Spacer8} from '../Spacers/Spacer';
import Tag from '../Tag/Tag';
import {BellFillIcon, CheckIcon} from '../Icons';
import {useTranslation} from 'react-i18next';
import {UserType} from '../../../../../shared/src/schemas/User';
import {ExerciseCard} from '../../../../../shared/src/types/generated/Exercise';
import ExerciseGraphic from '../ExerciseGraphic/ExerciseGraphic';
import Markdown from '../Typography/Markdown/Markdown';
import textStyles from '../Typography/styles';

export const HEIGHT = 175;

const markdownStyles = {
  body: {minHeight: '100%'},
  paragraph: {...textStyles.Body14},
};

const Wrapper = styled(TouchableOpacity)({
  borderRadius: 16,
  backgroundColor: COLORS.CREAM,
  height: HEIGHT,
  padding: 16,
  overflow: 'hidden',
});

const Graphic = styled(ExerciseGraphic)({
  width: 112,
  height: 112,
  alignSelf: 'flex-end',
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

const TagsGradient = styled(LinearGradient).attrs({
  start: {x: 0, y: 0},
  end: {x: 1, y: 0},
  colors: [
    hexToRgba(COLORS.CREAM, 0),
    hexToRgba(COLORS.CREAM, 1),
    hexToRgba(COLORS.CREAM, 1),
  ],
})({
  position: 'absolute',
  right: -SPACINGS.SIXTEEN,
  bottom: 0,
  width: 30,
  height: 20,
});

const TitleContainer = styled.View<{minHeight: boolean}>(({minHeight}) => ({
  minHeight: minHeight ? 42 : 'auto',
  justifyContent: 'center',
}));

const Title = styled(Display20)({
  textOverflow: 'ellipsis',
});

const Description = styled.View({
  flex: 1,
  overflow: 'hidden',
});

const DescriptionGradient = styled(LinearGradient).attrs({
  colors: [hexToRgba(COLORS.CREAM, 0), hexToRgba(COLORS.CREAM, 1)],
})({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  zIndex: 1,
});

const Content = styled.View({
  alignItems: 'flex-end',
  flexDirection: 'row',
  flex: 1,
});

type CardProps = {
  title?: string;
  description?: string;
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
  description,
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

  return (
    <Wrapper onPress={onPress} disabled={!onPress} style={style}>
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
        <TagsGradient />
      </Tags>
      <Spacer4 />
      <Row>
        <Main>
          <TitleContainer minHeight={Boolean(description)}>
            <Title numberOfLines={2}>{title}</Title>
          </TitleContainer>
          <Spacer4 />
          {hostProfile && (
            <Byline
              pictureURL={hostProfile.photoURL}
              name={hostProfile.displayName}
            />
          )}
          {description ? (
            <Description>
              <Markdown styles={markdownStyles}>{description}</Markdown>
              <DescriptionGradient />
            </Description>
          ) : (
            <Content>{children}</Content>
          )}
        </Main>
        <Spacer8 />
        <Graphic graphic={graphic} />
      </Row>
    </Wrapper>
  );
};

export default Card;
