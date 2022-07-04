import React from 'react';
import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {H1, H2, H3, H4} from './Heading/Heading';
import {B1, B2, B3} from './Text/Text';
import MarkdownRenderer from './Markdown/Markdown';

export const AllTypes = () => (
  <ScreenWrapper>
    <H1>Heading 1</H1>
    <H2>Heading 2</H2>
    <H3>Heading 3</H3>
    <H4>Heading 4</H4>
    <B1>Body 1</B1>
    <B2>Body 2</B2>
    <B3>Body 3</B3>
  </ScreenWrapper>
);
export const Headings = () => (
  <ScreenWrapper>
    <H1>Heading 1</H1>
    <H2>Heading 2</H2>
    <H3>Heading 3</H3>
    <H4>Heading 4</H4>
  </ScreenWrapper>
);
export const Bodies = () => (
  <ScreenWrapper>
    <B1>Body 1</B1>
    <B2>Body 2</B2>
    <B3>Body 3</B3>
  </ScreenWrapper>
);

export const Markdown = () => (
  <ScreenWrapper>
    <MarkdownRenderer>
      {`
# Heading1
## Heading2
### Heading3
#### Heading4
##### Heading5

Paragraph text **bold** *italic* ~~highlighted~~ http://29k.org

![An image](https://static.tildacdn.com/tild3631-3833-4238-a237-613330346266/white_circle_black.png)

----

* Unordered list item 1
* Unordered list item 2
* Unordered list with a lot of text that should line break.........

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list with a lot of text that should line break.........

>BlockQuote example`}
    </MarkdownRenderer>
  </ScreenWrapper>
);
