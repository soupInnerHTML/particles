import {sample} from 'lodash';

const AVATAR_COLORS = [
  'FF0000',
  '5D3FD3',
  '1F51FF',
  'D27D2D',
  '50C878',
  'F4BB44',
  '9F2B68',
  'B4C424',
  'E30B5C',
];

export default function () {
  return sample(AVATAR_COLORS);
}
