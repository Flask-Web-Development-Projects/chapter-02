import moment from 'moment';

export const API_HOST = `${process.env.REACT_APP_API_HOST || "http://localhost:5000"}/api/v1`;
const TIME_FMT = 'DD MMMM YYYY HH:mm:ss [UTC]';

export const resolveTime = (timeString: string) => {
  return moment.utc(timeString, TIME_FMT).fromNow();
}