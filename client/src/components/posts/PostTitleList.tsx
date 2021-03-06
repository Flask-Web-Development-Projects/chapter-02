import React from 'react';
import { Link } from 'react-router-dom';

import { Post } from '../../types';
import { resolveTime } from '../../util';

interface Props {
  posts: Array<Post>;
}

export const PostTitleList = ({ posts }: Props) => {
  return <div>
    { posts.map((post: Post) => {
      return <Link to={ `/posts/${ post.id }` } key={ post.id }>
        <section>
          <h4>{ post.title }</h4>
          <h5>Written { resolveTime(post.creation_date)}</h5>
          <p>
            <span>{post.views} views</span>
            <span>{post.liked_by.length} likes</span>
            <span>{post.comments.length} comments</span>
          </p>
        </section>
      </Link>;
    }) }
  </div>;
}