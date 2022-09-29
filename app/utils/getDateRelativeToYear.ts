import dayjs, {Dayjs} from 'dayjs';

export default function getDateRelativeToYear(
  this: Dayjs,
  formatSame: string,
  formatLast: string,
  now: Dayjs,
) {
  const isSameYear = this.year() === now.year();
  // const format = isSameYear ? 'MMMM DD' : 'MMMM DD, YYYY';
  const format = isSameYear ? formatSame : formatLast;
  return dayjs(this).format(format);
}
