import React, {useState, useEffect} from 'react';
import {Animated} from 'react-native';

type FadeInProps = {
  delay?: number;
  duration?: number;
  initialOpacity?: number;
  toValue?: number;
};
const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 200,
  duration = 300,
  initialOpacity = 0,
  toValue = 1,
}) => {
  const [fadeAnim] = useState(new Animated.Value(initialOpacity));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      delay,
      duration,
      toValue,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, delay, duration, toValue]);

  return <Animated.View style={{opacity: fadeAnim}}>{children}</Animated.View>;
};

export default FadeIn;
