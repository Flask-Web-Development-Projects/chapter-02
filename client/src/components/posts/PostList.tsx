import React from 'react';

import { PostListItem } from './PostListItem';
import { Post } from '../../types';

interface Props {
  posts: Array<Post>;
}

export const PostList = ({ posts }: Props) => {
  return <div>
    {posts.map((post: Post) => {
      return <PostListItem 
        key={ post.id }
        post={ post }
      />;
    })}
  </div>;
}