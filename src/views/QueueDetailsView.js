import React from 'react';
import AppLayout from '../layouts/AppLayout';

const QueueDetailsView = ({
  match: {
    params: { name },
  },
}) => {
  console.log(name);
  return (
    <AppLayout
      titleProps={{
        title: `Queue: ${name}`,
        backTo: '/',
      }}
    >
      ... queue details ...
    </AppLayout>
  );
};

export default QueueDetailsView;
