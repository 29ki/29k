import styled from 'styled-components';

const Columns = styled.div({
  display: 'grid',
  '@media(min-width: 720px)': {
    gridTemplateColumns: '1fr 1fr',
    columnGap: 16,
  },
});

export default Columns;
