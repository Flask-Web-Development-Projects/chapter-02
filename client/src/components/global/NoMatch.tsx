import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export const NoMatch = ({ location }: RouteComponentProps) => {
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}