import moment from 'moment';

const TIME_FMT = 'DD MMMM YYYY HH:mm:ss [UTC]';

export const resolveTime = (timeString: string) => {
  return moment.utc(timeString, TIME_FMT).fromNow();
}