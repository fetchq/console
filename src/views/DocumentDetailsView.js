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
        backTo: `/queues/${queueName}`,
      }}
    >
      <pre>{JSON.stringify(doc, null, 2)}</pre>
      {prevDoc && <Link to={`/queues/${queueName}/docs/${prevDoc}`}>prev</Link>}
      {' | '}
      {nextDoc && <Link to={`/queues/${queueName}/docs/${nextDoc}`}>next</Link>}
      <pre>{JSON.stringify(foo, null, 2)}</pre>
    </AppLayout>
  );
};

export default DocumentDetailsView;
