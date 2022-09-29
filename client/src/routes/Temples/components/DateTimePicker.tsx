import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {Modal, Platform} from 'react-native';
import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';

import {TopSafeArea} from '../../../common/components/Spacers/Spacer';

import TouchableOpacity from '../../../common/components/TouchableOpacity/TouchableOpacity';
import {
  Body16,
  BodyBold,
} from '../../../common/components/Typography/Body/Body';
import {COLORS} from '../../../common/constants/colors';
import {SPACINGS} from '../../../common/constants/spacings';

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
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
});

const DateTimePicker: React.FC<{
  mode: 'date' | 'time';
  selectedValue: any;
  setValue: Function;
  close: Function;
}> = ({mode, setValue, selectedValue, close}) => {
  switch (Platform.OS) {
    case 'ios':
      return (
        <Modal animationType="fade" transparent={true}>
          <ModalBackground>
            <TopSafeArea />
            <ModalView>
              <RNDateTimePicker
                mode={mode}
                display={mode === 'date' ? 'inline' : 'spinner'}
                value={selectedValue}
                onChange={(_, value) => setValue(value)}
              />
              <Button onPress={() => close()}>Done</Button>
            </ModalView>
          </ModalBackground>
        </Modal>
      );

    case 'android':
      return (
        <RNDateTimePicker
          mode={mode}
          display={mode === 'date' ? 'calendar' : 'clock'}
          value={selectedValue}
          onChange={(_, value) => setValue(value)}
        />
      );
    default:
      return null;
  }
};

const Picker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  return (
    <>
      <Wrapper>
        <Row
          onPress={() => {
            setMode('date');
            setShowPicker(true);
          }}>
          <Body16>
            <BodyBold>Date</BodyBold>
          </Body16>
          <Body16>{selectedDate.toDateString()}</Body16>
        </Row>
        <Row
          onPress={() => {
            setMode('time');
            setShowPicker(true);
          }}>
          <Body16>
            <BodyBold>Time</BodyBold>
          </Body16>
          <Body16>{selectedTime.toTimeString()}</Body16>
        </Row>
      </Wrapper>

      {showPicker && (
        <DateTimePicker
          mode={mode}
          selectedValue={mode === 'date' ? selectedDate : selectedTime}
          setValue={mode === 'date' ? setSelectedDate : setSelectedTime}
          close={() => setShowPicker(false)}
        />
      )}
    </>
  );
};

export default Picker;
