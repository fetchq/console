import React from 'react';

import { useDocumentDetails } from '../state/use-document-details';
import AppLayout from '../layouts/AppLayout';

const DocumentDetailsView = ({
  match: {
    params: { queueName, docSubject },
  },
}) => {
  const { doc, ...foo } = useDocumentDetails(queueName, docSubject);
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
      <pre>{JSON.stringify(foo, null, 2)}</pre>
    </AppLayout>
  );
};

export default DocumentDetailsView;
