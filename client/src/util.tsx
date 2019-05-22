import { Post } from "./types";
import moment from 'moment';

const TIME_FMT = 'DD MMMM YYYY HH:mm:ss [UTC]';

export const resolveTime = (post: Post) => {
  return moment.utc(post.creation_date, TIME_FMT).fromNow();
}