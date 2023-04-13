import React from 'react';
import Svg, {
  SvgProps,
  Ellipse,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';

type BackgroundGradientProps = SvgProps & {
  color?: string;
};

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  color = '#1F282F',
  ...props
}) => (
  <Svg viewBox="0 0 509 264" fill="none" preserveAspectRatio="none" {...props}>
    <Ellipse cx={254.5} cy={132} fill="url(#a)" rx={254.5} ry={132} />
    <Defs>
      <RadialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(0 132 -254.5 0 254.5 132)"
        gradientUnits="userSpaceOnUse">
        <Stop offset={0.083} stopColor={color} />
        <Stop offset={0.552} stopColor={color} stopOpacity={0.6} />
        <Stop offset={1} stopColor={color} stopOpacity={0} />
      </RadialGradient>
    </Defs>
  </Svg>
);

export default BackgroundGradient;
