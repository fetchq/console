import React from 'react';
import { Link } from 'react-router-dom';

import { useLogDetails } from '../state/use-log-details';
import { useDocumentDetails } from '../state/use-document-details';
import AppLayout from '../layouts/AppLayout';

const LogDetailsView = ({
  match: {
    params: { queueName, logId },
  },
}) => {
  const { log, nextLog, prevLog, ...logInfo } = useLogDetails(queueName, logId);
  const { doc, ...docInfo } = useDocumentDetails(queueName, log.subject);

  return (
    <AppLayout
      titleProps={{
        title: queueName,
        subtitle: 'Log Details',
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
      {prevLog && (
        <>
          <Link to={`/queues/${queueName}/logs/${prevLog}`}>prev</Link>
          {' | '}
        </>
      )}
      {nextLog && <Link to={`/queues/${queueName}/logs/${nextLog}`}>next</Link>}
      {' | '}
      <Link to={`/queues/${queueName}/docs/${log.subject}`}>Open Document</Link>
      <h2>Log:</h2>
      <pre>{JSON.stringify(log, null, 2)}</pre>
      <pre>{JSON.stringify(logInfo, null, 2)}</pre>
      <hr />
      <h2>Document:</h2>
      <pre>{JSON.stringify(doc, null, 2)}</pre>
      <pre>{JSON.stringify(docInfo, null, 2)}</pre>
    </AppLayout>
  );
};

export default LogDetailsView;
