import React from 'react';
import AppLayout from '../layouts/AppLayout';

import { useQueueDetails } from '../state/use-queue-details';

const QueueDetailsView = ({
  match: {
    params: { name },
  },
}) => {
  const info = useQueueDetails(name);

  return (
    <AppLayout
      titleProps={{
        title: `Queue: ${name}`,
        backTo: '/',
      }}
    >
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </AppLayout>
  );
};

export default QueueDetailsView;
