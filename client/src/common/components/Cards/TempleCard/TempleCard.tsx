import React from 'react';
import {Temple} from '../../../../../../shared/src/types/Temple';
import {Spacer8} from '../../Spacers/Spacer';
import {B3} from '../../Typography/Text/Text';
import Card from '../Card';

type TempleCardProps = {
  onPress?: () => void;
  temple: Temple;
  graphicSrc: string;
  animation?: boolean;
  time: string;
  buttonText: string;
};

const TempleCard: React.FC<TempleCardProps> = ({
  onPress = () => {},
  temple,
  graphicSrc,
  animation = false,
  buttonText,
  time,
}) => {
  const {name, url} = temple;

  const graphic = {src: graphicSrc, animation, alt: ''};

  return (
    <Card
      title={name}
      description={url}
      buttonText={buttonText}
      graphic={graphic}
      onPress={onPress}>
      {
        <>
          {/* Add Time component to handle "Starts in 20 min 18 sec" vs "The session will start Saturday at 13.00 " */}
          <B3>{time}</B3>
          <Spacer8 />
        </>
      }
    </Card>
  );
};

export default TempleCard;
