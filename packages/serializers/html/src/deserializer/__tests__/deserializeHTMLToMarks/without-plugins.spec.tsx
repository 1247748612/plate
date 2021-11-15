import { createPlateUIEditor } from '../../../../../../plate/src/utils/createPlateUIEditor';
import { deserializeHTMLToMarks } from '../../utils/deserializeHTMLToMarks';

const input = {
  plugins: [{}],
  element: document.createElement('strong'),
  children: [{ text: 'test' }],
};

const output = [{ text: 'test' }];

it('should be', () => {
  expect(deserializeHTMLToMarks(createPlateUIEditor(), input)).toEqual(output);
});
