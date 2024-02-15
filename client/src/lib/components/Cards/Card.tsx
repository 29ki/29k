import React, {Fragment} from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
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
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import CollectionTag from '../Tag/CollectionTag';

export const HEIGHT = 175;

type DescriptionTextProps = {
  textColor?: string;
};
const DescriptionText = styled(Markdown).attrs<DescriptionTextProps>(
  ({textColor}) => ({
    styles: {
      body: {minHeight: '100%'},
      paragraph: {
        ...textStyles.Body14,
        color: textColor,
      },
    },
  }),
)<DescriptionTextProps>({});

const Wrapper = styled(TouchableOpacity)<{backgroundColor?: string}>(
  ({backgroundColor = COLORS.CREAM}) => ({
    backgroundColor,
    borderRadius: 16,
    height: HEIGHT,
    padding: 16,
    overflow: 'hidden',
  }),
);

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

type TagsGradientProps = {
  color?: string;
};
const TagsGradient = styled(LinearGradient).attrs<
  TagsGradientProps,
  LinearGradientProps
>(({color = COLORS.CREAM}) => ({
  start: {x: 0, y: 0},
  end: {x: 1, y: 0},
  colors: [hexToRgba(color, 0), hexToRgba(color, 1), hexToRgba(color, 1)],
}))<TagsGradientProps>({
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

const Title = styled(Display20)<{color?: string}>(({color}) => ({
  color,
}));

const Description = styled.View({
  flex: 1,
  overflow: 'hidden',
});

type DescriptionGradientProps = {
  color?: string;
};
const DescriptionGradient = styled(LinearGradient).attrs<
  DescriptionGradientProps,
  LinearGradientProps
>(({color = COLORS.CREAM}) => ({
  colors: [hexToRgba(color, 0), hexToRgba(color, 1)],
}))<DescriptionGradientProps>({
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
  cardStyle?: ExerciseCard;
  onPress: () => void;
  children?: React.ReactNode;
  hostProfile?: UserType | null;
  isPinned?: boolean;
  reminderEnabled?: boolean;
  interestedCount?: number;
  collection?: Collection | null;
  style?: ViewStyle;
  backgroundColor?: string;
  textColor?: string;
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  tags,
  cardStyle,
  onPress,
  hostProfile,
  children,
  isPinned,
  reminderEnabled,
  interestedCount,
  collection,
  style,
  backgroundColor,
  textColor,
}) => {
  const {t} = useTranslation('Component.Card');

  return (
    <Wrapper
      onPress={onPress}
      disabled={!onPress}
      style={style}
      backgroundColor={backgroundColor}>
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
        {collection && (
          <>
            <CollectionTag>{collection.name}</CollectionTag>
            <Spacer4 />
          </>
        )}
        {tags &&
          tags.map(tag => (
            <Fragment key={tag}>
              <Tag>{tag}</Tag>
              <Spacer4 />
            </Fragment>
          ))}
        <TagsGradient color={backgroundColor} />
      </Tags>
      <Spacer4 />
      <Row>
        <Main>
          <TitleContainer minHeight={Boolean(description)}>
            <Title numberOfLines={2} color={textColor}>
              {title}
            </Title>
          </TitleContainer>
          <Spacer4 />
          {hostProfile && (
            <Byline
              pictureURL={hostProfile.photoURL}
              name={hostProfile.displayName}
              textColor={textColor}
            />
          )}
          {description ? (
            <Description>
              <DescriptionText textColor={textColor}>
                {description}
              </DescriptionText>
              <DescriptionGradient color={backgroundColor} />
            </Description>
          ) : (
            <Content>{children}</Content>
          )}
        </Main>
        <Spacer8 />
        <Graphic graphic={cardStyle} />
      </Row>
    </Wrapper>
  );
};

export default Card;
