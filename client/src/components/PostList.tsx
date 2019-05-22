import React from 'react';

import { Post } from '../types';
import { PostListItem } from './PostListItem';

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