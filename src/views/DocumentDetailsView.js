import React from 'react';
import { Link } from 'react-router-dom';

import { useDocumentDetails } from '../state/use-document-details';
import AppLayout from '../layouts/AppLayout';
import QueueLogsList from '../containers/QueueLogsList';
import ShortUUID from '../components/ShortUUID';

const DocumentDetailsView = ({
  match: {
    params: { queueName, docSubject },
  },
}) => {
  const { doc, nextDoc, prevDoc, ...foo } = useDocumentDetails(
    queueName,
    docSubject,
  );

  return (
    <AppLayout
      titleProps={{
        title: queueName,
        subtitle: docSubject,
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
          label: 'docs',
          href: `/queues/${queueName}/docs`,
        },
        {
          label: <ShortUUID uuid={docSubject} />,
          href: `/queues/${queueName}/docs/${docSubject}`,
        },
      ]}
    >
      <pre>{JSON.stringify(doc, null, 2)}</pre>
      {prevDoc && <Link to={`/queues/${queueName}/docs/${prevDoc}`}>prev</Link>}
      {' | '}
      {nextDoc && <Link to={`/queues/${queueName}/docs/${nextDoc}`}>next</Link>}
      <pre>{JSON.stringify(foo, null, 2)}</pre>
      {prevDoc}
      <br />
      {nextDoc}
      <hr />
      <QueueLogsList queueName={queueName} subject={docSubject} />
    </AppLayout>
  );
};

export default DocumentDetailsView;
