import React from 'react';
import { useHistory } from 'react-router-dom';

import { useDocumentCreate } from '../state/use-document-create';
import DocumentCreateForm from '../components/DocumentCreateForm';

const DocumentCreateView = ({
  match: {
    params: { queueName },
  },
}) => {
  const history = useHistory();
  const create = useDocumentCreate({
    queueName,
    onDocumentCreated: (data) => {
      if (
        confirm(
          `Document created: "${data.doc.subject}"\nWant to add one more?`,
          true,
        )
      )
        return;
      history.push(`/queues/${queueName}/docs/${data.doc.subject}`);
    },
  });

  return (
    <DocumentCreateForm onSubmit={create.onSubmit} onCancel={create.onCancel} />
  );
};

export default DocumentCreateView;
