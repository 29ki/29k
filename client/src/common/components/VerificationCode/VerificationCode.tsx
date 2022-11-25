import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TouchableOpacity,
} from 'react-native';
import {BottomSheetTextInput} from '../Typography/TextInput/TextInput';
import {TextInput} from 'react-native-gesture-handler';

import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';

const RowWrapper = styled.View({});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-around',
});

const Cell = styled(BottomSheetTextInput).attrs({
  keyboardType: 'numeric',
  autoCorrect: false,
})<{hasError?: boolean}>(({hasError}) => ({
  width: 36,
  paddingHorizontal: SPACINGS.EIGHT,
  textAlign: 'center',
  borderRadius: 8,
  borderColor: hasError ? COLORS.ERROR : undefined,
  borderWidth: hasError ? 1 : 0,
}));

type CellComponentProps = {
  value?: string;
  onKeyPress: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  onCellPress: () => void;
  onChangeText: (text: string) => void;
  hasError?: boolean;
};

const CellComponent = React.forwardRef<TextInput, CellComponentProps>(
  ({value, onCellPress, onKeyPress, onChangeText, hasError}, ref) => (
    <TouchableOpacity onPress={onCellPress}>
      <Cell
        autoCorrect={false}
        value={value}
        onTouchStart={onCellPress}
        ref={ref}
        onChangeText={onChangeText}
        onKeyPress={onKeyPress}
        selectTextOnFocus
        hasError={hasError}
      />
    </TouchableOpacity>
  ),
);

const NUMERIC_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

type VerificationCodeProps = {
  prefillCode?: string;
  onCodeCompleted: (result: number) => void;
  hasError?: boolean;
};

const VerificationCode: React.FC<VerificationCodeProps> = ({
  prefillCode = '',
  onCodeCompleted,
  hasError,
}) => {
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
  const [focusCells, setFocusCells] = useState(prefillCode.length !== 6);

  useEffect(() => {
    if (focusCells) {
      cells[currentCell].current?.focus();
    }
  }, [currentCell, cells, focusCells]);

  useEffect(() => {
    const codeString = code.join('');
    if (codeString.length === 6) {
      onCodeCompleted(parseInt(codeString, 10));
    }
  }, [code, onCodeCompleted]);

  useEffect(() => {
    let id: NodeJS.Timeout | undefined;
    const codeString = code.join('');
    if (codeString.length === 6 && hasError) {
      id = setTimeout(() => {
        setCode([]);
        cells[0].current?.focus();
      }, 1000);
    }

    return () => clearTimeout(id);
  }, [code, hasError, cells]);

  const updateCode = (index: number) => (text: string) => {
    if (text.length >= 6) {
      // From clipboard
      setCode([...text.trim().replace(' ', '')]);
    } else if (text.length <= 1) {
      //Allows also code to be erased
      setCode(c => {
        const clone = [...c];
        clone[index] = text;
        return clone;
      });
    } else {
      setCode(c => c);
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

  const onCellPress = (index: number) => () => {
    setFocusCells(true);
    setCurrentCell(index);
  };

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
            hasError={hasError}
          />
        ))}
      </Row>
    </RowWrapper>
  );
};

export default VerificationCode;
