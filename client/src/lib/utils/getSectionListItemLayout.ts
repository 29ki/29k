/**
 * Originally from https://github.com/jsoendermann/rn-section-list-get-item-layout
 */
import {SectionListData} from 'react-native';

export type SectionListDataProp = Array<{
  title: string;
  data: any[];
}>;

interface SectionHeader {
  type: 'SECTION_HEADER';
}

interface Row {
  type: 'ROW';
  index: number;
}

interface SectionFooter {
  type: 'SECTION_FOOTER';
}

type ListElement = SectionHeader | Row | SectionFooter;

export interface Parameters<ItemT, SectionT> {
  getItemHeight: (
    rowData: ItemT | undefined,
    sectionIndex: number,
    rowIndex: number,
  ) => number;
  getSeparatorHeight?: (sectionIndex: number, rowIndex: number) => number;
  getSectionHeaderHeight?: (
    section: SectionT | undefined,
    sectionIndex: number,
  ) => number;
  getSectionFooterHeight?: (
    section: SectionT | undefined,
    sectionIndex: number,
  ) => number;
  listHeaderHeight?: number | (() => number);
}

export default <ItemT, SectionT>({
    getItemHeight,
    getSeparatorHeight = () => 0,
    getSectionHeaderHeight = () => 0,
    getSectionFooterHeight = () => 0,
    listHeaderHeight = 0,
  }: Parameters<ItemT, SectionT>) =>
  (data: SectionListData<ItemT, SectionT>[] | null, index: number) => {
    let i = 0;
    let sectionIndex = 0;
    let elementPointer: ListElement = {type: 'SECTION_HEADER'};
    let offset =
      typeof listHeaderHeight === 'function'
        ? listHeaderHeight()
        : listHeaderHeight;

    while (i < index) {
      const section = data?.[sectionIndex];
      const sectionData = section?.data;

      switch (elementPointer.type) {
        case 'SECTION_HEADER': {
          offset += getSectionHeaderHeight(section, sectionIndex);

          // If this section is empty, we go right to the footer...
          if (sectionData?.length === 0) {
            elementPointer = {type: 'SECTION_FOOTER'};
            // ...otherwise we make elementPointer point at the first row in this section
          } else {
            elementPointer = {type: 'ROW', index: 0};
          }

          break;
        }
        case 'ROW': {
          const rowIndex = elementPointer.index;

          offset += getItemHeight(
            sectionData?.[rowIndex],
            sectionIndex,
            rowIndex,
          );
          elementPointer.index += 1;

          if (sectionData && rowIndex === sectionData.length - 1) {
            elementPointer = {type: 'SECTION_FOOTER'};
          } else {
            offset += getSeparatorHeight(sectionIndex, rowIndex);
          }

          break;
        }
        case 'SECTION_FOOTER': {
          offset += getSectionFooterHeight(section, sectionIndex);
          sectionIndex += 1;
          elementPointer = {type: 'SECTION_HEADER'};
          break;
        }
      }

      i += 1;
    }

    let length;
    const section = data?.[sectionIndex];
    switch (elementPointer.type) {
      case 'SECTION_HEADER':
        length = getSectionHeaderHeight(section, sectionIndex);
        break;
      case 'ROW':
        const rowIndex = elementPointer.index;
        length = getItemHeight(
          data?.[sectionIndex]?.data[rowIndex],
          sectionIndex,
          rowIndex,
        );
        break;
      case 'SECTION_FOOTER':
        length = getSectionFooterHeight(section, sectionIndex);
        break;
      default:
        throw new Error('Unknown elementPointer.type');
    }

    return {length, offset, index};
  };
