import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {CompletedSessionEvent} from '../../../../../../shared/src/types/Event';
import {ModalStackProps} from '../../../../lib/navigation/constants/routes';
import useConfirmPracticeReminders from '../../../../lib/sessions/hooks/useConfirmPracticeReminders';
import usePinnedCollections from '../../../../lib/user/hooks/usePinnedCollections';
import useGetCollectionsByExerciseId from '../../../../lib/content/hooks/useGetCollectionsByExerciseId';
import useRating from '../../../../lib/rating/hooks/useRating';
import {SessionMode} from '../../../../../../shared/src/schemas/Session';

const useHandleClose = () => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const confirmPracticeReminder = useConfirmPracticeReminders();
  const {pinnedCollections} = usePinnedCollections();
  const getCollectionsByExerciseId = useGetCollectionsByExerciseId();
  const askForRating = useRating();

  return useCallback(
    (
      completedSessionEvent: CompletedSessionEvent,
      answer: boolean | undefined,
    ) => {
      if (completedSessionEvent) {
        navigate('CompletedSessionModal', {
          completedSessionEvent,
        });

        const collections = getCollectionsByExerciseId(
          completedSessionEvent.payload.exerciseId,
        );

        if (
          completedSessionEvent.payload.mode === SessionMode.async &&
          collections.find(collection =>
            Boolean(
              pinnedCollections.find(
                pinnedCollection => pinnedCollection.id === collection.id,
              ),
            ),
          )
        ) {
          confirmPracticeReminder(true);
        }

        if (answer) {
          askForRating();
        }
      }
    },
    [
      pinnedCollections,
      navigate,
      getCollectionsByExerciseId,
      confirmPracticeReminder,
      askForRating,
    ],
  );
};

export default useHandleClose;
