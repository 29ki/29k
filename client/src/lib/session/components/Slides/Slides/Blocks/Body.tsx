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
    bullet_list_content: {
      flex: 0,
    },
    ordered_list_content: {
      flex: 0,
    },
    paragraph: {
      textAlign: 'center',
      color: textColor ?? COLORS.BLACK,
    },
  },
}))<TextProps>({alignItems: 'center'});

const Body: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const theme = useSessionState(state => state.exercise?.theme);

  return (
    <Gutters>
      <Spacer4 />
      <Text textColor={theme?.textColor}>{children}</Text>
    </Gutters>
  );
};

export default React.memo(Body);
