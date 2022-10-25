import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Input from '../../../common/components/Typography/TextInput/TextInput';

import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';
import {Spacer16} from '../../../common/components/Spacers/Spacer';
import {useTranslation} from 'react-i18next';
import NS from '../../../lib/i18n/constants/namespaces';

const RowWrapper = styled.View({});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-around',
});

const Cell = styled(Input).attrs({
  keyboardType: 'numeric',
  autoCorrect: false,
  maxLength: 1,
  clearTextOnFocus: true,
})({
  width: 50,
  maxWidth: 50,
  textAlign: 'center',
});

const Overlay = styled.View({
  position: 'absolute',
  width: '100%',
  height: 50,
  bottom: 0,
  left: 0,
  opacity: 0,
});

const NUMERIC_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

type VerificationCodeProps = {
  prefillCode?: string;
  onCodeCompleted: (result: number) => void;
};

const VerificationCode: React.FC<VerificationCodeProps> = ({
  prefillCode = '',
  onCodeCompleted,
}) => {
  const {t} = useTranslation(NS.COMPONENT.VERIFICATION_CODE);
  const cell1 = useRef<TextInput>(null);
  const cell2 = useRef<TextInput>(null);
  const cell3 = useRef<TextInput>(null);
  const cell4 = useRef<TextInput>(null);
  const cell5 = useRef<TextInput>(null);
  const cell6 = useRef<TextInput>(null);
  const cells = useMemo(
    () => [cell1, cell2, cell3, cell4, cell5, cell6],
    [cell1, cell2, cell3, cell4, cell5, cell6],
  );
  const [code, setCode] = useState(prefillCode);
  const [currentCell, setCurrentCell] = useState(0);

  useEffect(() => {
    if (code.length < 6) {
      cells[currentCell].current?.focus();
    }
  }, [currentCell, cells, code]);

  useEffect(() => {
    if (code.length === 6) {
      onCodeCompleted(parseInt(code, 10));
    }
  }, [code, onCodeCompleted]);

  const updateCode = (text: string) => {
    if (text.length === 1) {
      setCode(c => `${c}${text}`);
    } else {
      setCode(c => c.slice(0, c.length - 1));
    }
  };

  const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace') {
      setCurrentCell(c => Math.max(0, c - 1));
      setCode(c => c.slice(0, c.length - 1));
    } else if (NUMERIC_KEYS.find(n => n === e.nativeEvent.key)) {
      setCurrentCell(c => Math.min(5, c + 1));
    }
  };

  const paste = async () => {
    const clipboardString = await Clipboard.getString();
    setCode(clipboardString);
  };

  return (
    <RowWrapper>
      <Row>
        <Cell
          value={code.charAt(0)}
          ref={cell1}
          onChangeText={updateCode}
          onKeyPress={onKeyPress}
        />
        <Cell
          value={code.charAt(1)}
          ref={cell2}
          onChangeText={updateCode}
          onKeyPress={onKeyPress}
        />
        <Cell
          value={code.charAt(2)}
          ref={cell3}
          onChangeText={updateCode}
          onKeyPress={onKeyPress}
        />
        <Cell
          value={code.charAt(3)}
          ref={cell4}
          onChangeText={updateCode}
          onKeyPress={onKeyPress}
        />
        <Cell
          value={code.charAt(4)}
          ref={cell5}
          onChangeText={updateCode}
          onKeyPress={onKeyPress}
        />
        <Cell
          value={code.charAt(5)}
          ref={cell6}
          onChangeText={updateCode}
          onKeyPress={onKeyPress}
        />
      </Row>
      <Overlay />
      <Spacer16 />
      <Button onPress={paste}>{t('pasteButton')}</Button>
    </RowWrapper>
  );
};

export default VerificationCode;
