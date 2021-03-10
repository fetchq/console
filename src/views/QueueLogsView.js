import React from 'react';
import QueueLogsList from '../containers/QueueLogsList';

const QueueLogsView = ({
  match: {
    params: { queueName },
  },
}) => <QueueLogsList queueName={queueName} />;

export default QueueLogsView;
