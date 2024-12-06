import {useBottomSheet} from '@gorhom/bottom-sheet';
import {useCallback} from 'react';

/*
  This hook hides the current modal and opens the share modal to prevent it from being rendered behind the current modal
  Bottom sheet modals are rendered with FullWindowModal, which is a full-screen modal that covers the entire screen
  https://github.com/th3rdwave/react-navigation-bottom-sheet/blob/ef8c616559a3fdbb67149d6e1ebc9bb662d71255/src/BottomSheetView.tsx#L27-L31
*/
const useHideModalUntilResolved = <TArgs extends any[]>(
  fn: (...args: TArgs) => Promise<any>,
) => {
  const bottomSheet = useBottomSheet();
  return useCallback(
    async (...args: TArgs) => {
      const currentSnapIndex = bottomSheet.animatedIndex.value;
      bottomSheet.snapToPosition(0.0000001); // Hide without closing it
      const ret = await fn(...args);
      bottomSheet.snapToIndex(currentSnapIndex); // Restore the position
      return ret;
    },
    [bottomSheet, fn],
  );
};

export default useHideModalUntilResolved;
