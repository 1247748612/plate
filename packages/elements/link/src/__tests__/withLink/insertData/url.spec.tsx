/** @jsx jsx */

import { withInlineVoid } from '@udecode/plate-core';
import { jsx } from '@udecode/plate-test-utils';
import { withReact } from 'slate-react';
import { ELEMENT_LINK } from '../../../createLinkPlugin';
import { withLink } from '../../../withLink';

jsx;

const input = (
  <editor>
    <hp>
      test
      <cursor />
    </hp>
  </editor>
) as any;

const data: any = { getData: () => 'http://google.com' };

const output = (
  <editor>
    <hp>
      test
      <element type="a" url="http://google.com">
        http://google.com
      </element>
      <htext />
    </hp>
  </editor>
) as any;

it('should run default insertText', () => {
  const editor = withLink()(
    withInlineVoid({ inlineTypes: [ELEMENT_LINK] })(withReact(input))
  );

  editor.insertData(data);

  expect(input.children).toEqual(output.children);
});
