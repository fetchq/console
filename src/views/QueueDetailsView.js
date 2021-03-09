import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';

import { useQueueDetails } from '../state/use-queue-details';

import AppLayout from '../layouts/AppLayout';
import QueueDetailsInfo from '../components/QueueDetailsInfo';
import QueueDocsView from './QueueDocsView';
import QueueLogsView from './QueueLogsView';

const QueueDetailsView = ({
  match: {
    params: { queueName },
  },
}) => {
  const { queue, metrics, hasData, reload, ...info } = useQueueDetails(
    queueName,
  );

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

      <Link to={`/queues/${queueName}/docs`}>Documents</Link>
      {' | '}
      <Link to={`/queues/${queueName}/logs`}>Logs</Link>

      <pre>{JSON.stringify(info, null, 2)}</pre>

      <Switch>
        <Route path="/queues/:queueName/docs" component={QueueDocsView} />
        <Route path="/queues/:queueName/logs" component={QueueLogsView} />
      </Switch>
    </AppLayout>
  );
};

export default QueueDetailsView;
