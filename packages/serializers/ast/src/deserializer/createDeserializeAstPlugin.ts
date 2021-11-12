import { createPlugin, WithOverride } from '@udecode/plate-core';
import {
  insertDeserializedFragment,
  isDeserializerEnabled,
} from '@udecode/plate-serializer';

export const astDeserializerId = 'AST Deserializer';

/**
 * Enables support for deserializing inserted content from Slate Ast format to Slate format
 * while apply a small bug fix.
 */
export const withDeserializeAst = (): WithOverride => (editor) => {
  const { insertData } = editor;

  editor.insertData = (data: DataTransfer) => {
    const ast = data.getData('application/x-slate-fragment');

    const isEnabled = isDeserializerEnabled(
      editor,
      editor.plugins,
      astDeserializerId
    );

    if (ast && isEnabled) {
      const decoded = decodeURIComponent(window.atob(ast));
      const fragment = JSON.parse(decoded);

      if (fragment.length) {
        return insertDeserializedFragment(editor, {
          fragment,
          plugins: editor.plugins,
        });
      }
    }

    insertData(data);
  };

  return editor;
};

/**
 * @see {@link withDeserializeAst}
 */
export const createDeserializeAstPlugin = createPlugin({
  key: 'deserializeAst',
  withOverrides: withDeserializeAst(),
});
