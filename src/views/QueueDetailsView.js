import React from 'react';
import AppLayout from '../layouts/AppLayout';

import { useQueueDetails } from '../state/use-queue-details';
import { useQueueDocuments } from '../state/use-queue-documents';
import { useQueueLogs } from '../state/use-queue-logs';
import QueueDetailsInfo from '../components/QueueDetailsInfo';
import QueueDocumentsList from '../components/QueueDocumentsList';
import QueueLogsList from '../components/QueueLogsList';

const QueueDetailsView = ({
  match: {
    params: { name },
  },
}) => {
  const { queue, metrics, hasData, reload, ...info } = useQueueDetails(name);
  const documents = useQueueDocuments(name);
  const logs = useQueueLogs(name);

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
      {logs.hasData && <QueueLogsList {...logs} />}
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </AppLayout>
  );
};

export default QueueDetailsView;
