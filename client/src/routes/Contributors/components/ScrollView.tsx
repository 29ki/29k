import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';

export const ScrollView = styled(BottomSheetScrollView).attrs({
  focusHook: useIsFocused,
  contentContainerStyle: {paddingTop: 90},
})({...StyleSheet.absoluteFillObject});
