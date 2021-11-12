/** @jsx jsx */

import { PlateEditor } from '@udecode/plate-core';
import { jsx } from '@udecode/plate-test-utils';
import { ELEMENT_LINK } from '../../../../../elements/link/src/createLinkPlugin';
import { withRemoveEmptyNodes } from '../../withRemoveEmptyNodes';

jsx;

const input = ((
  <editor>
    <hp>
      <ha url="http://google.com">
        <htext />
      </ha>
      <cursor />
    </hp>
  </editor>
) as any) as PlateEditor;

const output = (
  <editor>
    <hp>
      <htext />
    </hp>
  </editor>
) as any;

it('should be', () => {
  const editor = withRemoveEmptyNodes({ type: ELEMENT_LINK })(input);

  editor.normalizeNode([(input.children[0] as any).children[0], [0, 0]]);

  expect(input.children).toEqual(output.children);
});
