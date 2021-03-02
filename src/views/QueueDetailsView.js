import React from 'react';
import AppLayout from '../layouts/AppLayout';

import { useQueueDetails } from '../state/use-queue-details';
import QueueDetailsInfo from '../components/QueueDetailsInfo';

const QueueDetailsView = ({
  match: {
    params: { name },
  },
}) => {
  const { queue, metrics, hasData, reload, ...info } = useQueueDetails(name);

  return (
    <AppLayout
      titleProps={{
        title: `Queue: ${name}`,
        backTo: '/',
      }}
    >
      {hasData && (
        <QueueDetailsInfo queue={queue} metrics={metrics} reload={reload} />
      )}
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </AppLayout>
  );
};

export default QueueDetailsView;
