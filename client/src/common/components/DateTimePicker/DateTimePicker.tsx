import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import utc from 'dayjs/plugin/utc';
import {useTranslation} from 'react-i18next';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';

import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Body16, BodyBold} from '../Typography/Body/Body';

dayjs.extend(utc);

const Wrapper = styled.View({
  backgroundColor: COLORS.WHITE,
  borderRadius: SPACINGS.EIGHT,
});

const Row = styled(TouchableOpacity)({
  paddingHorizontal: SPACINGS.SIXTEEN,
  paddingVertical: SPACINGS.EIGHT,
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const SelectedText = styled(Body16)<{isActive?: boolean}>(({isActive}) => ({
  color: isActive ? COLORS.PRIMARY : COLORS.BLACK,
}));

const DateTimePicker: React.FC<{
  mode: 'date' | 'time';
  selectedValue: dayjs.Dayjs;
  setValue: Dispatch<SetStateAction<dayjs.Dayjs>>;
  close: () => void;
  maximumDate?: dayjs.Dayjs;
  minimumDate?: dayjs.Dayjs;
}> = ({mode, setValue, selectedValue, close, minimumDate, maximumDate}) => {
  const onChangeIos = useCallback(
    (_: DateTimePickerEvent, value: Date | undefined) =>
      setValue(dayjs(value).utc()),
    [setValue],
  );

  const onChangeAndroid = useCallback(
    (_: DateTimePickerEvent, value: Date | undefined) => {
      close();
      setValue(dayjs(value).utc());
    },
    [close, setValue],
  );

  switch (Platform.OS) {
    case 'ios':
      return (
        <RNDateTimePicker
          mode={mode}
          textColor={COLORS.BLACK}
          accentColor={COLORS.PRIMARY}
          display={mode === 'date' ? 'inline' : 'spinner'}
          value={selectedValue.local().toDate()}
          onChange={onChangeIos}
          minimumDate={mode === 'date' ? minimumDate?.toDate() : undefined}
          maximumDate={mode === 'date' ? maximumDate?.toDate() : undefined}
        />
      );

    case 'android':
      return (
        <RNDateTimePicker
          mode={mode}
          display={mode === 'date' ? 'calendar' : 'clock'}
          value={selectedValue.local().toDate()}
          minimumDate={mode === 'date' ? minimumDate?.toDate() : undefined}
          maximumDate={mode === 'date' ? maximumDate?.toDate() : undefined}
          onChange={onChangeAndroid}
        />
      );
    default:
      return null;
  }
};

type PickerProps = {
  onChange?: (date: dayjs.Dayjs, time: dayjs.Dayjs) => void;
  maximumDate?: dayjs.Dayjs;
  minimumDate?: dayjs.Dayjs;
  initialDateTime?: dayjs.Dayjs;
  onToggle?: (expanded: boolean) => void;
};

const Picker: React.FC<PickerProps> = ({
  onChange = () => {},
  minimumDate,
  maximumDate,
  initialDateTime = dayjs().utc(),
  onToggle = () => {},
}) => {
  const {t} = useTranslation('Component.DateTimePicker');
  const [selectedDate, setSelectedDate] = useState(initialDateTime);
  const [selectedTime, setSelectedTime] = useState(initialDateTime);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(
    () => onChange(selectedDate, selectedTime),
    [selectedDate, selectedTime, onChange],
  );

  const onDatePress = useCallback(() => {
    setShowTimePicker(false);
    setShowDatePicker(!showDatePicker);
    onToggle(!showDatePicker);
  }, [setShowTimePicker, showDatePicker, onToggle]);

  const onTimePress = useCallback(() => {
    setShowDatePicker(false);
    setShowTimePicker(!showDatePicker);
    onToggle(!showDatePicker);
  }, [setShowTimePicker, showDatePicker, onToggle]);

  const onClose = useCallback(
    () => setShowDatePicker(false),
    [setShowDatePicker],
  );

  return (
    <>
      <Wrapper>
        <Row onPress={onDatePress}>
          <Body16>
            <BodyBold>{t('date')}</BodyBold>
          </Body16>
          <SelectedText isActive={showDatePicker}>
            {selectedDate.local().format('dddd, D MMM')}
          </SelectedText>
        </Row>
        {showDatePicker && (
          <DateTimePicker
            mode="date"
            selectedValue={selectedDate}
            setValue={setSelectedDate}
            close={onClose}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )}
        <Row onPress={onTimePress}>
          <Body16>
            <BodyBold>{t('time')}</BodyBold>
          </Body16>
          <SelectedText isActive={showTimePicker}>
            {selectedTime.local().format('LT')}
          </SelectedText>
        </Row>
        {showTimePicker && (
          <DateTimePicker
            mode="time"
            selectedValue={selectedTime}
            setValue={setSelectedTime}
            close={onClose}
          />
        )}
      </Wrapper>
    </>
  );
};

export default Picker;
