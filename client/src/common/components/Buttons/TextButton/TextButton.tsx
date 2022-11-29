import React from 'react';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';
import {Body16} from '../../Typography/Body/Body';

type TextButtonProps = {
  title: string;
  onPress: () => void;
};
const TextButton: React.FC<TextButtonProps> = ({title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Body16>{title}</Body16>
    </TouchableOpacity>
  );
};
export default TextButton;
