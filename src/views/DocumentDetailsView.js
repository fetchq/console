import React from 'react';
import { Link } from 'react-router-dom';

import { useDocumentDetails } from '../state/use-document-details';
import AppLayout from '../layouts/AppLayout';

const DocumentDetailsView = ({
  match: {
    params: { queueName, docSubject },
  },
}) => {
  const { doc, nextDoc, prevDoc, ...foo } = useDocumentDetails(
    queueName,
    docSubject,
  );
  console.log(foo);
  return (
    <AppLayout
      titleProps={{
        title: docSubject,
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
          label: 'docs',
          href: `/queues/${queueName}/docs`,
        },
        {
          label: docSubject,
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
    </AppLayout>
  );
};

export default DocumentDetailsView;
