import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import TextInput from '../../common/components/Typography/TextInput/TextInput';
import Gutters from '../../common/components/Gutters/Gutters';
import NS from '../../lib/i18n/constants/namespaces';
import useTemples from './hooks/useTemples';
import {Spacer16, TopSafeArea} from '../../common/components/Spacers/Spacer';
import Button from '../../common/components/Buttons/Button';
import {useNavigation} from '@react-navigation/native';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import {BackIcon} from '../../common/components/Icons';
import {H3} from '../../common/components/Typography/Heading/Heading';
import styled from 'styled-components/native';
import {COLORS} from '../../common/constants/colors';

const Wrapper = styled.View({
  backgroundColor: COLORS.WHITE_EASY,
  borderRadius: 25,
  height: '50%',
});

const KeyboardAvoidingView = styled.KeyboardAvoidingView({
  flex: 1,
  justifyContent: 'flex-end',
});

const CreateTemple = () => {
  const {goBack} = useNavigation();
  const {t} = useTranslation(NS.SCREEN.ADD_TEMPLE);
  const [newTemple, setNewTemple] = useState<string>();
  const {addTemple} = useTemples();

  return (
    <KeyboardAvoidingView behavior="padding">
      <Wrapper>
        <TopSafeArea />
        <Gutters>
          <IconButton onPress={goBack} Icon={BackIcon} />
          <Spacer16 />
          <H3>{t('heading')}</H3>
          <Spacer16 />
          <TextInput
            onChangeText={setNewTemple}
            placeholder={t('createPlaceholder')}
          />
          <Spacer16 />
          <Button
            primary
            disabled={Boolean(!newTemple || newTemple?.length < 3)}
            onPress={async () => {
              await addTemple(newTemple);
              goBack();
            }}>
            {t('create')}
          </Button>
        </Gutters>
      </Wrapper>
    </KeyboardAvoidingView>
  );
};

export default CreateTemple;
