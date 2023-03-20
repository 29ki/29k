import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';

import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';

import {useIsFocused} from '@react-navigation/native';

import {Spacer16} from '../../../lib/components/Spacers/Spacer';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import IconButton from '../../../lib/components/Buttons/IconButton/IconButton';
import {Pause, Play, Rewind} from '../../../lib/components/Icons';
import styled from 'styled-components/native';
import Audio from '../../../lib/audio/components/Audio';

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const CalmDownModal = () => {
  const {t} = useTranslation('Modal.CalmDown');
  const [paused, setPaused] = useState(true);

  const onTogglePlayingPress = useCallback(
    () => setPaused(!paused),
    [setPaused, paused],
  );

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Gutters>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer16 />
          <Markdown>{t('body__markdown')}</Markdown>
          <Audio source={t('audio')} paused={paused} />
          <Row>
            <IconButton
              small
              elevated
              variant="tertiary"
              Icon={paused ? Play : Pause}
              onPress={onTogglePlayingPress}
            />
          </Row>
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default CalmDownModal;
