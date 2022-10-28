import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Input from '../../../common/components/Typography/TextInput/TextInput';

import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';
import {Spacer16} from '../../../common/components/Spacers/Spacer';
import {useTranslation} from 'react-i18next';
import * as NS from '../../../../../shared/src/constants/namespaces';

const RowWrapper = styled.View({});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-around',
});

const Cell = styled(Input).attrs({
  keyboardType: 'numeric',
  autoCorrect: false,
  maxLength: 1,
})({
  width: 50,
  maxWidth: 50,
  textAlign: 'center',
});

type CellComponentProps = {
  value?: string;
  onKeyPress: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  onCellPress: () => void;
  onChangeText: (text: string) => void;
};

const CellComponent = React.forwardRef<TextInput, CellComponentProps>(
  ({value, onCellPress, onKeyPress, onChangeText}, ref) => (
    <TouchableOpacity onPress={onCellPress}>
      <Cell
        autoCorrect={false}
        value={value}
        onTouchStart={onCellPress}
        ref={ref}
        onChangeText={onChangeText}
        onKeyPress={onKeyPress}
        selectTextOnFocus
      />
    </TouchableOpacity>
  ),
);

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
  const [code, setCode] = useState<Array<string>>(
    prefillCode ? prefillCode.split('') : [],
  );
  const [currentCell, setCurrentCell] = useState(0);

  useEffect(() => {
    cells[currentCell].current?.focus();
  }, [currentCell, cells]);

  useEffect(() => {
    const codeString = code.join('');
    if (codeString.length === 6) {
      onCodeCompleted(parseInt(codeString, 10));
    }
  }, [code, onCodeCompleted]);

  const updateCode = (index: number) => (text: string) => {
    //Allows also code to be erased
    if (text.length <= 2) {
      setCode(c => {
        const clone = [...c];
        clone[index] = text;
        return clone;
      });
    }
  };

  const onKeyPress =
    (index: number) =>
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === 'Backspace') {
        setCurrentCell(Math.max(0, index - 1));
      } else if (NUMERIC_KEYS.find(n => n === e.nativeEvent.key)) {
        setCurrentCell(Math.min(5, index + 1));
      }
    };

  const paste = async () => {
    const clipboardString = await Clipboard.getString();
    setCode(clipboardString.split(''));
  };

  const onCellPress = (index: number) => () => setCurrentCell(index);

  return (
    <RowWrapper>
      <Row>
        {cells.map((cellRef, index) => (
          <CellComponent
            key={index}
            value={code[index]}
            onCellPress={onCellPress(index)}
            ref={cellRef}
            onChangeText={updateCode(index)}
            onKeyPress={onKeyPress(index)}
          />
        ))}
      </Row>

      <Spacer16 />
      <Button onPress={paste}>{t('pasteButton')}</Button>
    </RowWrapper>
  );
};

export default VerificationCode;
