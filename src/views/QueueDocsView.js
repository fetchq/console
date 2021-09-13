import React from 'react';
import { useHistory } from 'react-router-dom';

import { useQueueDocs } from '../state/use-queue-docs';
import { useDocumentCreate } from '../state/use-document-create';
import QueueDocumentsList from '../components/QueueDocumentsList';

const QueueDocsView = ({
  match: {
    params: { queueName },
  },
}) => {
  const history = useHistory();
  const documents = useQueueDocs(queueName);
  const create = useDocumentCreate(queueName);

  const onDiscloseDocument = (doc) =>
    history.push(`/queues/${queueName}/docs/${doc.subject}`);

  return (
    <>
      <QueueDocumentsList
        {...documents}
        onDiscloseDocument={onDiscloseDocument}
      />
    </>
  );
};

export default QueueDocsView;
