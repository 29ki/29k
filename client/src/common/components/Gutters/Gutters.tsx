import styled from 'styled-components/native';
import {GUTTERS} from '../../constants/spacings';

const Gutters = styled.View<{big?: boolean}>(({big}) => ({
  paddingHorizontal: big ? GUTTERS.BIG : GUTTERS.SMALL,
}));

export default Gutters;
