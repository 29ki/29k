import {exerciseIds} from '../../../../../content/content.json';
import {Exercise} from '../../../../../shared/src/types/Content';

const useExerciseIds = () => exerciseIds as Exercise['id'][];

export default useExerciseIds;
