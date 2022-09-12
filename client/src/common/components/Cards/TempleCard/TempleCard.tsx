import {AnimationObject} from 'lottie-react-native';
import React from 'react';
import {ImageSourcePropType} from 'react-native';
import {Temple} from '../../../../../../shared/src/types/Temple';
import {Spacer8} from '../../Spacers/Spacer';
import {B3} from '../../Typography/Text/Text';
import Card from '../Card';

type TempleCardProps = {
  onPress?: () => void;
  temple: Temple;
  image?: ImageSourcePropType;
  lottie?: AnimationObject;
  time: string;
  buttonText: string;
};

const TempleCard: React.FC<TempleCardProps> = ({
  onPress = () => {},
  temple,
  buttonText,
  time,
  image,
  lottie,
}) => {
  const {name, url} = temple;

  return (
    <Card
      title={name}
      description={url}
      buttonText={buttonText}
      image={image}
      lottie={lottie}
      onPress={onPress}>
      {/* Add Time component to handle "Starts in 20 min 18 sec" vs "The session will start Saturday at 13.00 " */}
      <B3>{time}</B3>
      <Spacer8 />
    </Card>
  );
};

export default TempleCard;
