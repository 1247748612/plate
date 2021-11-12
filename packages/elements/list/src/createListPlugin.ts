import { createPlugin, PlatePlugin } from '@udecode/plate-core';
import {
  getLicDeserialize,
  getLiDeserialize,
  getOlDeserialize,
  getUlDeserialize,
} from './getListDeserialize';
import { getListOnKeyDown } from './getListOnKeyDown';
import { ListPlugin } from './types';
import { withList } from './withList';

export const ELEMENT_UL = 'ul';
export const ELEMENT_OL = 'ol';
export const ELEMENT_LI = 'li';
export const ELEMENT_LIC = 'lic';

/**
 * Enables support for bulleted, numbered and to-do lists.
 */
export const createListPlugin = createPlugin({
  key: 'list',
  plugins: [
    {
      key: ELEMENT_UL,
      isElement: true,
      deserialize: getUlDeserialize(),
      onKeyDown: getListOnKeyDown(),
      withOverrides: withList(),
    } as PlatePlugin<{}, ListPlugin>,
    {
      key: ELEMENT_OL,
      isElement: true,
      onKeyDown: getListOnKeyDown(),
      deserialize: getOlDeserialize(),
    } as PlatePlugin<{}, ListPlugin>,
    {
      key: ELEMENT_LI,
      isElement: true,
      deserialize: getLiDeserialize(),
    },
    {
      key: ELEMENT_LIC,
      isElement: true,
      deserialize: getLicDeserialize(),
    },
  ],
});
