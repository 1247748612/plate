/** @jsx jsx */
import { PlateEditor, PlatePlugin } from '@udecode/plate-core';
import { jsx } from '@udecode/plate-test-utils';
import { createMediaEmbedPlugin } from '../../../../../../elements/media-embed/src/createMediaEmbedPlugin';
import { createPlateUIEditor } from '../../../../../../plate/src/utils/createPlateUIEditor';

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
  getData: () => '<html><body><iframe>inserted</iframe></body></html>',
};

const output = (
  <editor>
    <hp>
      testinserted
      <cursor />
    </hp>
  </editor>
) as any;

describe('when inserting an iframe', () => {
  it('should do nothing', () => {
    const plugins: PlatePlugin[] = [createMediaEmbedPlugin()];
    plugins.push(createDeserializeHTMLPlugin());

    const editor = createPlateUIEditor({
      editor: input,
      plugins,
    });

    editor.insertData(data as any);

    expect(editor.children).toEqual(output.children);
  });
});
