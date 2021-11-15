/** @jsx jsx */
import { PlateEditor, PlatePlugin } from '@udecode/plate-core';
import { jsx } from '@udecode/plate-test-utils';
import { createBoldPlugin } from '../../../../../../marks/basic-marks/src/bold/createBoldPlugin';
import { createPlateUIEditor } from '../../../../../../plate/src/utils/createPlateUIEditor';
import { createDeserializeHtmlPlugin } from '../../createDeserializeHtmlPlugin';

jsx;

const input = ((
  <editor>
    <hp>
      test
      <cursor />
    </hp>
  </editor>
) as any) as PlateEditor;

// noinspection CheckTagEmptyBody
const data = {
  getData: () => '<html></html>',
};

const output = (
  <editor>
    <hp>
      test
      <cursor />
    </hp>
  </editor>
) as any;

describe('when inserting empty html', () => {
  it('should do nothing', () => {
    const plugins: PlatePlugin[] = [
      createBoldPlugin(),
      createDeserializeHtmlPlugin(),
    ];

    const editor = createPlateUIEditor({
      editor: input,
      plugins,
    });

    editor.insertData(data as any);

    expect(editor.children).toEqual(output.children);
  });
});
