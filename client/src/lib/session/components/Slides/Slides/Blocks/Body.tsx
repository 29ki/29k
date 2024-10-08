import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../../shared/src/constants/colors';
import Gutters from '../../../../../components/Gutters/Gutters';
import {Spacer4} from '../../../../../components/Spacers/Spacer';
import useSessionState from '../../../../state/state';
import Markdown from '../../../../../components/Typography/Markdown/Markdown';

type TextProps = {textColor?: string};
const Text = styled(Markdown).attrs<TextProps>(({textColor}) => ({
  styles: {
    body: {
      alignItems: 'center',
    },
    bullet_list: {
      color: textColor ?? COLORS.BLACK,
    },
    bullet_list_content: {
      flex: 0,
    },
    ordered_list: {
      color: textColor ?? COLORS.BLACK,
    },
    ordered_list_content: {
      flex: 0,
    },
    bullet_list_icon: {
      backgroundColor: textColor ?? COLORS.BLACK,
    },
    ordered_list_icon: {
      color: textColor ?? COLORS.BLACK,
    },
    text: {
      textAlign: 'center',
      color: textColor ?? COLORS.BLACK,
    },
  },
}))<TextProps>({alignItems: 'center'});

const Wrapper = styled(Gutters)({
  alignItems: 'center',
});

const Body: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const theme = useSessionState(state => state.exercise?.theme);

  return (
    <Wrapper>
      <Spacer4 />
      <Text textColor={theme?.textColor}>{children}</Text>
    </Wrapper>
  );
};

export default React.memo(Body);
