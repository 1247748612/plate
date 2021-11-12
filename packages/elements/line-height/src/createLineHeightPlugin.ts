import { ELEMENT_DEFAULT } from '@udecode/plate-common';
import { createPlugin, getPluginType } from '@udecode/plate-core';

export const KEY_LINE_HEIGHT = 'lineHeight';

/**
 * Enables support for text alignment, useful to align your content
 * to left, right and center it.
 */
export const createLineHeightPlugin = createPlugin({
  key: KEY_LINE_HEIGHT,
  overrideProps: {
    defaultNodeValue: 1.5,
    validNodeValues: [1, 1.2, 1.5, 2, 3],
  },
  then: (editor) => ({
    overrideProps: {
      validTypes: [getPluginType(editor, ELEMENT_DEFAULT)],
    },
  }),
});
