import dayjs from 'dayjs';

export default function (seconds: Maybe<number>) {
  return (
    'Last seen ' + (seconds ? dayjs.unix(Number(seconds)).fromNow() : 'never')
  );
}
