import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TextGutter} from '../../common/components/Gutters/Gutters';

TextGutter;
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    zIndex: 1,
  },
  overlayContent: {
    alignItems: 'center',
    minHeight: 200,
  },
});

export const Overlay: React.FC = ({children}) => (
  <View style={styles.overlay}>{children}</View>
);

export const TextOverlay: React.FC = ({children}) => (
  <View style={styles.overlay}>
    <TextGutter>
      <View style={styles.overlayContent}>{children}</View>
    </TextGutter>
  </View>
);
