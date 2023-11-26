import styled from 'styled-components/native';
import Tag from './Tag';
import {CollectionIcon} from '../Icons';

const CollectionTag = styled(Tag).attrs({
  LeftIcon: CollectionIcon,
})({
  backgroundColor: '#FDB',
});

export default CollectionTag;
