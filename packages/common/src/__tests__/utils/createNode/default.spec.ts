import { TElement } from '@udecode/plate-core';
import { ELEMENT_PARAGRAPH } from '../../../../../elements/paragraph/src/createParagraphPlugin';
import { createNode } from '../../../utils/index';

const output: TElement = { type: ELEMENT_PARAGRAPH, children: [{ text: '' }] };

it('should be', () => {
  expect(createNode()).toEqual(output);
});
