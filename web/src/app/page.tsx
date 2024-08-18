'use client';

import styled from 'styled-components';
import {Card} from '../../../client/src/lib/components/Cards/Card';
import exercise from '../../../content/src/exercises/0db526a6-9f70-4cf8-8903-71feb68413c1.json';

const Foo = styled.div({
  color: 'red',
});

export default function Home() {
  const data = exercise['en'];
  return (
    <Card
      title={data.name}
      tags={[]}
      description={data.description}
      cardStyle={data.card}
      onPress={() => null}
    />
  );
}
