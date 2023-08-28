import React, {useCallback, useState} from 'react';
import styled from 'styled-components/native';
import TouchableOpacity from '../../../components/TouchableOpacity/TouchableOpacity';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import SETTINGS from '../../../constants/settings';
import {SPACINGS} from '../../../constants/spacings';
import {Body16} from '../../../components/Typography/Body/Body';
import {Spacer8} from '../../../components/Spacers/Spacer';

const Container = styled(TouchableOpacity)<{active: boolean}>(({active}) => ({
  ...(active ? SETTINGS.BOXSHADOW_SMALL : {}),
  backgroundColor: COLORS.PURE_WHITE,
  borderRadius: SETTINGS.BORDER_RADIUS.FLOATING_CONTENT,
  padding: SPACINGS.EIGHT,
}));

type AccordionItem = {
  title: string;
  expanded?: boolean;
  children: React.ReactNode;
};

const AccordionItem: React.FC<AccordionItem> = ({
  expanded = false,
  title,
  children,
}) => {
  const [active, setActive] = useState(expanded);

  const toggleActive = useCallback(
    () => setActive(!active),
    [setActive, active],
  );

  return (
    <Container active={active} onPress={toggleActive}>
      <Body16>{title}</Body16>

      {active ? (
        <>
          <Spacer8 />
          {children}
        </>
      ) : null}
    </Container>
  );
};

export default React.memo(AccordionItem);
