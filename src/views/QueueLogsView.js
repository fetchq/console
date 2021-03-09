import React from 'react';
import { useHistory } from 'react-router-dom';

import { useQueueLogs } from '../state/use-queue-logs';
import QueueLogsList from '../components/QueueLogsList';

const QueueLogsView = ({
  match: {
    params: { queueName },
  },
}) => {
  const history = useHistory();
  const logs = useQueueLogs(queueName);

  const onLogDisclose = (log) =>
    history.push(`/queues/${queueName}/logs/${log.id}`);

  return <QueueLogsList {...logs} onLogDisclose={onLogDisclose} />;
};

export default QueueLogsView;
