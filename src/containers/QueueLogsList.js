import React from 'react';
import { useHistory } from 'react-router-dom';

import { useQueueLogs } from '../state/use-queue-logs';
import QueueLogsListComponent from '../components/QueueLogsList';

const QueueLogsList = ({ queueName, subject }) => {
  const history = useHistory();

  const logs = useQueueLogs(queueName, {
    subject,
  });

  const onLogDisclose = (log) =>
    history.push(`/queues/${queueName}/logs/${log.id}`);

  return <QueueLogsListComponent {...logs} onLogDisclose={onLogDisclose} />;
};

export default QueueLogsList;
