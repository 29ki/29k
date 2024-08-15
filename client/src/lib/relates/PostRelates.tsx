import React from 'react';
import {PostType} from '../../../../shared/src/schemas/Post';
import Relates from './Relates';
import {ViewStyle} from 'react-native';
import TouchableOpacity from '../components/TouchableOpacity/TouchableOpacity';
import useTogglePostRelate from './hooks/useTogglePostRelate';
import {Spacer8} from '../components/Spacers/Spacer';
import {Body14, BodyBold} from '../components/Typography/Body/Body';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';

const Wrapper = styled(TouchableOpacity)({
  flexDirection: 'row',
  alignItems: 'center',
});

type Props = {
  post: PostType;
  interactive?: boolean;
  style?: ViewStyle;
};
const PostRelates = ({post, interactive, style}: Props) => {
  const {t} = useTranslation('Component.PostRelates');
  const {relatesCount, toggleRelate} = useTogglePostRelate(post);

  if (!interactive && !relatesCount) return null;

  return (
    <Wrapper
      onPress={toggleRelate}
      disabled={!interactive}
      style={style}
      hitSlop={{bottom: 5, top: 5}}>
      {interactive && (
        <>
          <Body14>
            <BodyBold>{t('relate')}</BodyBold>
          </Body14>
          <Spacer8 />
        </>
      )}
      <Relates count={relatesCount} />
    </Wrapper>
  );
};

export default React.memo(PostRelates);
