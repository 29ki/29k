import React from 'react';
import {View} from 'react-native';
import Byline from '../Bylines/Byline';
import {ExerciseCoCreator} from '../../../../../shared/src/types/generated/Exercise';
import {CollectionCoCreator} from '../../../../../shared/src/types/generated/Collection';
import * as linking from '../../linking/nativeLinks';
import {Spacer4} from '../Spacers/Spacer';

type Props = {
  coCreators: ExerciseCoCreator[] | CollectionCoCreator[] | undefined;
};

const CoCreators: React.FC<Props> = ({coCreators}) => (
  <>
    {coCreators
      ? coCreators.map(({name, image, url}, idx) => (
          <View key={`${name}-${idx}`}>
            <Byline
              small
              prefix={false}
              pictureURL={image}
              name={name}
              onPress={url ? () => linking.openURL(url) : undefined}
            />
            <Spacer4 />
          </View>
        ))
      : null}
  </>
);

export default CoCreators;
