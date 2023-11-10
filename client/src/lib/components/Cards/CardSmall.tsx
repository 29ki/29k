import React, {Fragment, useMemo} from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
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
import ExerciseGraphic from '../ExerciseGraphic/ExerciseGraphic';

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

const Graphic = styled(ExerciseGraphic)({
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

const TagsGradient = styled(LinearGradient)({
  position: 'absolute',
  right: -SPACINGS.SIXTEEN,
  bottom: 0,
  width: 30,
  height: 20,
});

const Title = styled(Display16)({
  textOverflow: 'ellipsis',
});

const Content = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

type CardProps = {
  title?: string;
  tags?: Array<string>;
  graphic?: ExerciseCard;
  onPress?: () => void;
  hostProfile?: UserType | null;
  completed?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
};

export const CardSmall: React.FC<CardProps> = ({
  title,
  tags,
  graphic,
  onPress,
  hostProfile,
  completed,
  style,
  children,
}) => {
  const colors = useMemo(
    () => [
      hexToRgba(COLORS.CREAM, 0),
      hexToRgba(COLORS.CREAM, 1),
      hexToRgba(COLORS.CREAM, 1),
    ],
    [],
  );

  return (
    <Wrapper
      onPress={onPress}
      disabled={!onPress}
      style={style}
      backgroundColor={completed ? COLORS.LIGHT_GREEN : COLORS.CREAM}>
      <Main>
        {tags && (
          <>
            <Tags>
              {tags &&
                tags.map(tag => (
                  <Fragment key={tag}>
                    <Tag>{tag}</Tag>
                    <Spacer4 />
                  </Fragment>
                ))}
              <TagsGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={colors}
              />
            </Tags>
            <Spacer4 />
          </>
        )}
        <Title numberOfLines={children || tags ? 1 : 3}>{title}</Title>
        {hostProfile && (
          <>
            <Spacer4 />
            <Byline
              small
              pictureURL={hostProfile.photoURL}
              name={hostProfile.displayName}
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
      <Graphic graphic={graphic} />
    </Wrapper>
  );
};

export default CardSmall;
