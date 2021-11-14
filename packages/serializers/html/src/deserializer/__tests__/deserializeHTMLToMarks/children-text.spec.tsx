/** @jsx jsx */

import { jsx } from '@udecode/plate-test-utils';
import { createBoldPlugin } from '../../../../../../marks/basic-marks/src/bold/createBoldPlugin';
import { createPlateEditor } from '../../../../../../plate/src/utils/createPlateEditor';
import {
  deserializeHTMLToMarks,
  DeserializeMarksProps,
} from '../../utils/deserializeHTMLToMarks';

jsx;

const input: DeserializeMarksProps = {
  plugins: [createBoldPlugin()],
  element: document.createElement('strong'),
  children: <fragment>test</fragment>,
} as any;

const output = (
  <fragment>
    <htext bold>test</htext>
  </fragment>
);

it('should be', () => {
  expect(deserializeHTMLToMarks(createPlateEditor(), input as any)).toEqual(
    output
  );
});
