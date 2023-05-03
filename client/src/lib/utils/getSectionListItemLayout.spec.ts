/**
 * Originally from https://github.com/jsoendermann/rn-section-list-get-item-layout
 */
import sectionListGetItemLayout from './getSectionListItemLayout';

describe('getSectionListItemLayout', () => {
  it('works with empty sections', () => {
    const getItemLayout = sectionListGetItemLayout({
      getItemHeight: () => 2,
      getSeparatorHeight: () => 23,
      getSectionHeaderHeight: () => 41,
      getSectionFooterHeight: () => 61,
    });

    const data = [{data: []}, {data: []}, {data: [null]}];

    expect(getItemLayout(data, 0)).toEqual({length: 41, offset: 0, index: 0});
    expect(getItemLayout(data, 1)).toEqual({length: 61, offset: 41, index: 1});
    expect(getItemLayout(data, 5)).toEqual({
      length: 2,
      offset: 41 * 3 + 61 * 2,
      index: 5,
    });
    expect(getItemLayout(data, 6)).toEqual({
      length: 61,
      offset: 41 * 3 + 61 * 2 + 2,
      index: 6,
    });
  });

  it('works with multiple rows', () => {
    const getItemLayout = sectionListGetItemLayout({
      getItemHeight: () => 2,
      getSeparatorHeight: () => 23,
      getSectionHeaderHeight: () => 41,
      getSectionFooterHeight: () => 61,
    });

    const data = [{data: [null, null, null]}];

    expect(getItemLayout(data, 2)).toEqual({
      length: 2,
      offset: 41 + 2 + 23,
      index: 2,
    });
  });

  it('works with only getItemHeight', () => {
    const getItemLayout = sectionListGetItemLayout({
      getItemHeight: () => 1,
    });

    const data = [{data: [null, null]}];

    expect(getItemLayout(data, 0)).toEqual({length: 0, offset: 0, index: 0});
    expect(getItemLayout(data, 1)).toEqual({length: 1, offset: 0, index: 1});
    expect(getItemLayout(data, 2)).toEqual({length: 1, offset: 1, index: 2});
    expect(getItemLayout(data, 3)).toEqual({length: 0, offset: 2, index: 3});
  });
});
