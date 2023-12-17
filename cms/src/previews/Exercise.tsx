import React from 'react';
import {Card} from '../../../client/src/lib/components/Cards/Card';
import {PreviewTemplateComponentProps} from 'decap-cms-core';

const ExercisePreview = (props: PreviewTemplateComponentProps) => {
  const entry = props.entry.get('data').toJS();
  return (
    <>
      <Card
        title={entry.name}
        description={entry.description}
        cardStyle={entry.card}
        onPress={() => null}
      />
    </>
  );
};

export default ExercisePreview;
