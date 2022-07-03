import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {SPACINGS} from '../../../common/constants/spacings';

const styles = StyleSheet.create({
  wrapper: {flex: 1, padding: SPACINGS.SIXTEEN},
});

const ScreenWrapper: React.FunctionComponent = ({children}) => (
  <ScrollView>
    <SafeAreaView>
      <View style={styles.wrapper}>{children}</View>
    </SafeAreaView>
  </ScrollView>
);

export default ScreenWrapper;
