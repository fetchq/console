import React from 'react';
import { useHistory } from 'react-router-dom';

import { useQueueDetails } from '../state/use-queue-details';
import { useQueueDocs } from '../state/use-queue-docs';
import { useQueueLogs } from '../state/use-queue-logs';
import AppLayout from '../layouts/AppLayout';
import QueueDetailsInfo from '../components/QueueDetailsInfo';
import QueueDocumentsList from '../components/QueueDocumentsList';
import QueueLogsList from '../components/QueueLogsList';

const QueueDetailsView = ({
  match: {
    params: { queueName },
  },
}) => {
  const history = useHistory();
  const { queue, metrics, hasData, reload, ...info } = useQueueDetails(
    queueName,
  );
  const documents = useQueueDocs(queueName);
  const logs = useQueueLogs(queueName);

  const onDocDisclose = (doc) =>
    history.push(`/queues/${queueName}/docs/${doc.subject}`);

  const onLogDisclose = (log) =>
    history.push(`/queues/${queueName}/logs/${log.id}`);

  return (
    <AppLayout
      titleProps={{
        title: `Queue: ${queueName}`,
        backTo: '/',
      }}
    >
      {hasData && (
        <QueueDetailsInfo queue={queue} metrics={metrics} reload={reload} />
      )}
      {documents.hasData && (
        <QueueDocumentsList {...documents} onDocDisclose={onDocDisclose} />
      )}
      {logs.hasData && (
        <QueueLogsList {...logs} onLogDisclose={onLogDisclose} />
      )}
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </AppLayout>
  );
};

export default QueueDetailsView;
