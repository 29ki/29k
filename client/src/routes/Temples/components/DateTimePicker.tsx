import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import styled from 'styled-components/native';

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

const Picker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <>
      <Wrapper>
        <Row onPress={() => setShowDatePicker(!showDatePicker)}>
          <Body16>
            <BodyBold>Date</BodyBold>
          </Body16>
          <Body16>{selectedDate.toDateString()}</Body16>
        </Row>
        <Row>
          <Body16>
            <BodyBold>Time</BodyBold>
          </Body16>
          <Body16>18:00</Body16>
        </Row>
      </Wrapper>
      {showDatePicker && <DateTimePicker value={selectedDate} />}
    </>
  );
};

export default Picker;
