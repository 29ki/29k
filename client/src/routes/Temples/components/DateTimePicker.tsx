import RNDateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Modal, Platform} from 'react-native';
import styled from 'styled-components/native';
import utc from 'dayjs/plugin/utc';

import {COLORS} from '../../../common/constants/colors';
import {SPACINGS} from '../../../common/constants/spacings';

import Button from '../../../common/components/Buttons/Button';
import {TopSafeArea} from '../../../common/components/Spacers/Spacer';
import TouchableOpacity from '../../../common/components/TouchableOpacity/TouchableOpacity';
import {
  Body16,
  BodyBold,
} from '../../../common/components/Typography/Body/Body';

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

const ModalBackground = styled.View({
  justifyContent: 'center',
  backgroundColor: COLORS.BLACK_TRANSPARENT,
  flex: 1,
});

const ModalView = styled.View({
  margin: SPACINGS.TWENTY,
  backgroundColor: COLORS.WHITE,
  borderRadius: SPACINGS.TWELVE,
  padding: SPACINGS.THIRTYTWO,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
});

const DoneButton = styled(Button)({alignSelf: 'center'});

const DateTimePicker: React.FC<{
  mode: 'date' | 'time';
  selectedValue: dayjs.Dayjs;
  setValue: Dispatch<SetStateAction<dayjs.Dayjs>>;
  close: () => void;
  maximumDate?: Date;
  minimumDate?: Date;
}> = ({mode, setValue, selectedValue, close, minimumDate, maximumDate}) => {
  switch (Platform.OS) {
    case 'ios':
      return (
        <Modal animationType="fade" transparent={true}>
          <ModalBackground>
            <TopSafeArea />
            <ModalView>
              <RNDateTimePicker
                mode={mode}
                accentColor={COLORS.BLACK}
                textColor={COLORS.BLACK}
                display={mode === 'date' ? 'inline' : 'spinner'}
                value={selectedValue.local().toDate()}
                onChange={(_, value) => setValue(dayjs(value).utc())}
                minimumDate={mode === 'date' ? minimumDate : undefined}
                maximumDate={mode === 'date' ? maximumDate : undefined}
              />
              <DoneButton variant="secondary" small onPress={close}>
                {'Done'}
              </DoneButton>
            </ModalView>
          </ModalBackground>
        </Modal>
      );

    case 'android':
      return (
        <RNDateTimePicker
          mode={mode}
          display={mode === 'date' ? 'calendar' : 'clock'}
          value={selectedValue.local().toDate()}
          minimumDate={mode === 'date' ? minimumDate : undefined}
          maximumDate={mode === 'date' ? maximumDate : undefined}
          onChange={(_, value) => {
            close();
            setValue(dayjs(value).utc());
          }}
        />
      );
    default:
      return null;
  }
};

type PickerProps = {
  onChange?: (date: dayjs.Dayjs, time: dayjs.Dayjs) => void;
  maximumDate?: Date;
  minimumDate?: Date;
};

const Picker: React.FC<PickerProps> = ({
  onChange = () => {},
  minimumDate,
  maximumDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs().utc());
  const [selectedTime, setSelectedTime] = useState(dayjs().utc());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  useEffect(
    () => onChange(selectedDate, selectedTime),
    [selectedDate, selectedTime, onChange],
  );

  return (
    <>
      <Wrapper>
        <Row
          onPress={() => {
            setMode('date');
            setShowPicker(true);
          }}>
          <Body16>
            <BodyBold>{'Date'}</BodyBold>
          </Body16>
          <Body16>{selectedDate.local().format('dddd, D MMM')}</Body16>
        </Row>
        <Row
          onPress={() => {
            setMode('time');
            setShowPicker(true);
          }}>
          <Body16>
            <BodyBold>{'Time'}</BodyBold>
          </Body16>
          <Body16>{selectedTime.local().format('HH:mm')}</Body16>
        </Row>
      </Wrapper>

      {showPicker && (
        <DateTimePicker
          mode={mode}
          selectedValue={mode === 'date' ? selectedDate : selectedTime}
          setValue={mode === 'date' ? setSelectedDate : setSelectedTime}
          close={() => setShowPicker(false)}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </>
  );
};

export default Picker;
