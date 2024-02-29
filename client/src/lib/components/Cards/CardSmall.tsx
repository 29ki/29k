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
import {Display16} from '../Typography/Display/Display';
import Byline from '../Bylines/Byline';
import {Spacer4, Spacer8} from '../Spacers/Spacer';
import Tag from '../Tag/Tag';
import {UserType} from '../../../../../shared/src/schemas/User';
import {ExerciseCard} from '../../../../../shared/src/types/generated/Exercise';
import CardGraphic from '../CardGraphic/CardGraphic';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import CollectionTag from '../Tag/CollectionTag';

export const HEIGHT = 80;

const Wrapper = styled(TouchableOpacity)<{backgroundColor: string}>(
  ({backgroundColor}) => ({
    height: HEIGHT,
    borderRadius: 16,
    backgroundColor,
    padding: 8,
    paddingLeft: 16,
    flexDirection: 'row',
    overflow: 'hidden',
  }),
);

const Graphic = styled(CardGraphic)({
  width: 64,
  height: 64,
});

const Main = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const Tags = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  overflow: 'hidden',
});

type TagsGradientProps = {
  color?: string;
};
const TagsGradient = styled(LinearGradient).attrs<TagsGradientProps>(
  ({color = COLORS.CREAM}) => ({
    start: {x: 0, y: 0},
    end: {x: 1, y: 0},
    colors: [hexToRgba(color, 0), hexToRgba(color, 1), hexToRgba(color, 1)],
    // Fixes issue with types not being passed down properly from .attrs
  }),
)<Optional<LinearGradientProps, 'colors'>>({
  position: 'absolute',
  right: -SPACINGS.SIXTEEN,
  bottom: 0,
  width: 30,
  height: 20,
});

const Title = styled(Display16)<{color?: string}>(({color}) => ({
  color,
}));

const Content = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

type CardProps = {
  title?: string;
  tags?: Array<string>;
  cardStyle?: ExerciseCard;
  onPress?: () => void;
  hostProfile?: UserType | null;
  completed?: boolean;
  collection?: Collection | null;
  style?: ViewStyle;
  children?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
};

export const CardSmall: React.FC<CardProps> = ({
  title,
  tags,
  cardStyle,
  onPress,
  hostProfile,
  completed,
  collection,
  style,
  children,
  backgroundColor,
  textColor,
}) => {
  return (
    <Wrapper
      onPress={onPress}
      disabled={!onPress}
      style={style}
      backgroundColor={
        completed ? COLORS.LIGHT_GREEN : backgroundColor || COLORS.CREAM
      }>
      <Main>
        {(tags || collection) && (
          <>
            <Tags>
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
          </>
        )}
        <Title
          numberOfLines={children || tags || collection ? 1 : 3}
          color={textColor}>
          {title}
        </Title>
        {hostProfile && (
          <>
            <Spacer4 />
            <Byline
              small
              pictureURL={hostProfile.photoURL}
              name={hostProfile.displayName}
              textColor={textColor}
            />
          </>
        )}
        {children && (
          <>
            <Spacer4 />
            <Content>{children}</Content>
          </>
        )}
      </Main>
      <Spacer8 />
      <Graphic graphic={cardStyle} />
    </Wrapper>
  );
};

export default CardSmall;
