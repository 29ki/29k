import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useState} from 'react';
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

type DateTimePickerProps = {
  mode: 'date' | 'time';
  selectedValue: dayjs.Dayjs;
  setValue: (value: dayjs.Dayjs) => void;
  close: () => void;
  maximumDate?: dayjs.Dayjs;
  minimumDate?: dayjs.Dayjs;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  mode,
  setValue,
  selectedValue,
  close,
  minimumDate,
  maximumDate,
}) => {
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
          minimumDate={minimumDate?.toDate()}
          maximumDate={maximumDate?.toDate()}
        />
      );

    case 'android':
      return (
        <RNDateTimePicker
          mode={mode}
          display={mode === 'date' ? 'calendar' : 'clock'}
          value={selectedValue.local().toDate()}
          minimumDate={minimumDate?.toDate()}
          maximumDate={maximumDate?.toDate()}
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
  const [selectedDateTime, setSelectedDateTime] = useState(initialDateTime);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    onChange(selectedDateTime, selectedDateTime);
  }, [selectedDateTime, minimumDate, onChange]);

  const setDateTime: DateTimePickerProps['setValue'] = useCallback(
    value => {
      setSelectedDateTime(
        minimumDate && value.isBefore(minimumDate.utc())
          ? minimumDate.utc()
          : value,
      );
    },
    [minimumDate],
  );

  const onDatePress = useCallback(() => {
    setShowTimePicker(false);
    setShowDatePicker(!showDatePicker);
    onToggle(!showDatePicker);
  }, [setShowTimePicker, showDatePicker, onToggle]);

  const onTimePress = useCallback(() => {
    setShowDatePicker(false);
    setShowTimePicker(!showTimePicker);
    onToggle(!showTimePicker);
  }, [setShowTimePicker, showTimePicker, onToggle]);

  const onClose = useCallback(() => {
    setShowDatePicker(false);
    setShowTimePicker(false);
  }, [setShowDatePicker]);

  return (
    <>
      <Wrapper>
        <Row onPress={onDatePress}>
          <Body16>
            <BodyBold>{t('date')}</BodyBold>
          </Body16>
          <SelectedText isActive={showDatePicker}>
            {selectedDateTime.local().format('dddd, D MMM')}
          </SelectedText>
        </Row>
        {showDatePicker && (
          <DateTimePicker
            mode="date"
            selectedValue={selectedDateTime}
            setValue={setDateTime}
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
            {selectedDateTime.local().format('LT')}
          </SelectedText>
        </Row>
        {showTimePicker && (
          <DateTimePicker
            mode="time"
            minimumDate={minimumDate}
            selectedValue={selectedDateTime}
            setValue={setDateTime}
            close={onClose}
          />
        )}
      </Wrapper>
    </>
  );
};

export default Picker;
