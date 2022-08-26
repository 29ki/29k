import React from 'react';
import {Temple} from '../../../../../../shared/src/types/Temple';
import {Spacer8} from '../../Spacers/Spacer';
import {B3} from '../../Typography/Text/Text';
import Card from '../Card';

type TempleCardProps = {
  onPress?: () => void;
  temple: Temple;
  lottieSrc: string;
  time: string;
  buttonText: string;
};

const TempleCard: React.FC<TempleCardProps> = ({
  onPress = () => {},
  temple,
  lottieSrc,
  buttonText,
  time,
}) => {
  const {name, url} = temple;

  const lottieGraphics = {src: lottieSrc, animation: true, alt: ''};

  return (
    <Card
      title={name}
      description={url}
      buttonText={buttonText}
      graphic={lottieGraphics}
      onPress={onPress}>
      {
        <>
          <B3>{time}</B3>
          <Spacer8 />
        </>
      }
    </Card>
  );
};

export default TempleCard;
