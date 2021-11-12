import { createPlugin } from '@udecode/plate-core';
import { getMentionDeserialize } from './getMentionDeserialize';
import { moveSelectionByOffset } from './moveSelectionByOffset';
import { isSelectionInMentionInput } from './queries';
import { MentionPlugin } from './types';
import { withMention } from './withMention';

export const ELEMENT_MENTION = 'mention';
export const ELEMENT_MENTION_INPUT = 'mention_input';

/**
 * Enables support for autocompleting @mentions.
 */
export const createMentionPlugin = createPlugin<MentionPlugin>({
  key: ELEMENT_MENTION,
  isElement: true,
  isInline: true,
  isVoid: true,
  deserialize: getMentionDeserialize(),
  onKeyDown: (editor) =>
    moveSelectionByOffset(editor, { query: isSelectionInMentionInput }),
  withOverrides: withMention(),
  trigger: '@',
  createMentionNode: (item) => ({ value: item.text }),
  plugins: [
    {
      key: ELEMENT_MENTION_INPUT,
      isElement: true,
      isInline: true,
    },
  ],
});
