import React from 'react';
import AppLayout from '../layouts/AppLayout';

import { useQueueDetails } from '../state/use-queue-details';
import { useQueueDocuments } from '../state/use-queue-documents';
import QueueDetailsInfo from '../components/QueueDetailsInfo';
import QueueDocumentsList from '../components/QueueDocumentsList';

const QueueDetailsView = ({
  match: {
    params: { name },
  },
}) => {
  const { queue, metrics, hasData, reload, ...info } = useQueueDetails(name);
  const documents = useQueueDocuments(name);

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
      {documents.hasData && <QueueDocumentsList {...documents} />}
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </AppLayout>
  );
};

export default QueueDetailsView;
