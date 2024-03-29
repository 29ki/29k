import React from 'react';
import {ClipPath, Defs, G, Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const ReportIcon: IconType = ({fill = COLORS.BLACK, style}) => (
  <Icon style={style}>
    <G clipPath="url(#a)">
      <Path
        d="M7.645 24.414c.528 0 .99-.226 1.639-.782l3.042-2.712c.687.725 1.732 1.12 3.041 1.12h3.211l3.136 2.684c.622.528 1.046.82 1.554.82.744 0 1.186-.528 1.186-1.347v-2.156h.424c2.373 0 3.955-1.46 3.955-3.908v-5.726c0-2.486-1.61-3.955-4.02-3.955h-1.63v-.63c0-2.562-1.563-4.078-4.143-4.078H5.32c-2.505 0-4.153 1.516-4.153 4.077v8.814c0 2.524 1.62 4.021 4.087 4.021H6.44v2.42c0 .83.443 1.338 1.205 1.338Zm.462-4.652c0-.565-.349-.848-.81-.848h-1.77c-1.573 0-2.515-.885-2.515-2.523V8.019c0-1.648.951-2.533 2.515-2.533h13.296c1.573 0 2.514.885 2.514 2.533v.433h-5.97c-2.505 0-4.03 1.47-4.03 3.955v5.735c0 .405.037.782.122 1.13L8.107 22.4v-2.637Zm14.69 3.767-2.966-2.684c-.405-.367-.744-.528-1.29-.528h-2.985c-1.488 0-2.402-.828-2.402-2.4l.01-5.34c0-1.563.904-2.41 2.392-2.41h9.059c1.497 0 2.4.847 2.4 2.41v5.34c0 1.562-.913 2.4-2.4 2.4h-1.008c-.461 0-.81.273-.81.838v2.374Zm-2.703-7.195c.471 0 .735-.264.754-.763l.132-3.06c.018-.537-.368-.895-.895-.895s-.904.358-.876.885l.123 3.07c.019.49.282.763.762.763Zm0 2.872c.566 0 1.017-.405 1.017-.96 0-.546-.451-.951-1.017-.951-.583 0-1.026.414-1.026.95 0 .547.452.961 1.026.961Z"
        fill={fill}
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h30v30H0z" />
      </ClipPath>
    </Defs>
  </Icon>
);
