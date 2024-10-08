import styled from 'styled-components/native';
import {ExerciseWithLanguage} from '../../../../../../../client/src/lib/content/types';
import {LogoIcon} from '../../../../../../../client/src/lib/components/Icons';
import {Display28} from '../../../../../../../client/src/lib/components/Typography/Display/Display';
import {Spacer16} from '../../../../../../../client/src/lib/components/Spacers/Spacer';
import {COLORS} from '../../../../../../../shared/src/constants/colors';

const Wrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Logo = styled(LogoIcon)({
  width: 44,
  height: 44,
});

const Heading = styled(Display28)<{textColor?: string}>(({textColor}) => ({
  color: textColor ?? COLORS.BLACK,
}));

const Title = ({exercise}: {exercise: ExerciseWithLanguage | null}) => {
  return (
    <Wrapper>
      <Logo fill={exercise?.theme?.textColor} />
      <Spacer16 />
      <Heading textColor={exercise?.theme?.textColor}>{exercise?.name}</Heading>
    </Wrapper>
  );
};

export default Title;
