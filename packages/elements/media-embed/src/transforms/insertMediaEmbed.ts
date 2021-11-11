import { getParent, insertNodes } from '@udecode/plate-common';
import { PlateEditor, PlatePluginKey, TElement } from '@udecode/plate-core';
import { ELEMENT_MEDIA_EMBED } from '../defaults';
import { MediaEmbedNodeData } from '../types';

export const insertMediaEmbed = (
  editor: PlateEditor,
  {
    url = '',
    key = ELEMENT_MEDIA_EMBED,
  }: Partial<MediaEmbedNodeData> & PlatePluginKey
): void => {
  if (!editor.selection) return;
  const selectionParentEntry = getParent(editor, editor.selection);
  if (!selectionParentEntry) return;
  const [, path] = selectionParentEntry;
  insertNodes<TElement>(
    editor,
    {
      type: key,
      url,
      children: [{ text: '' }],
    },
    { at: path }
  );
};
