import React from 'react';
import { Link } from 'react-router-dom';

import { useLogDetails } from '../state/use-log-details';
import AppLayout from '../layouts/AppLayout';

const LogDetailsView = ({
  match: {
    params: { queueName, logId },
  },
}) => {
  const { log, nextLog, prevLog, ...foo } = useLogDetails(queueName, logId);

  return (
    <AppLayout
      titleProps={{
        title: 'Log Details',
        subtitle: queueName,
      }}
      breadCrumb={[
        {
          label: 'queues',
          href: '/',
        },
        {
          label: queueName,
          href: `/queues/${queueName}`,
        },
        {
          label: 'logs',
          href: `/queues/${queueName}/logs`,
        },
        {
          label: logId,
          href: `/queues/${queueName}/logs/${logId}`,
        },
      ]}
    >
      <pre>{JSON.stringify(log, null, 2)}</pre>
      {prevLog && <Link to={`/queues/${queueName}/logs/${prevLog}`}>prev</Link>}
      {' | '}
      {nextLog && <Link to={`/queues/${queueName}/logs/${nextLog}`}>next</Link>}
      {' | '}
      <Link to={`/queues/${queueName}/docs/${log.subject}`}>Open Document</Link>
      <pre>{JSON.stringify(foo, null, 2)}</pre>
      {prevLog}
      <br />
      {nextLog}
    </AppLayout>
  );
};

export default LogDetailsView;
