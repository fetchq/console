import React from 'react';
import AppLayout from '../layouts/AppLayout';
import { Route, useHistory } from 'react-router-dom';

import { useQueueDetails } from '../state/use-queue-details';
import { useQueueDocuments } from '../state/use-queue-documents';
import { useQueueLogs } from '../state/use-queue-logs';
import QueueDetailsInfo from '../components/QueueDetailsInfo';
import QueueDocumentsList from '../components/QueueDocumentsList';
import QueueLogsList from '../components/QueueLogsList';

const QueueDetailsView = ({
  match: {
    params: { name },
  },
}) => {
  const history = useHistory();
  const { queue, metrics, hasData, reload, ...info } = useQueueDetails(name);
  const documents = useQueueDocuments(name);
  const logs = useQueueLogs(name);

  const onDocDisclose = (doc) =>
    history.push(`/queues/${name}/doc/${doc.subject}`);

  return (
    <AppLayout
      titleProps={{
        title: `Queue: ${name}`,
        backTo: '/',
      }}
    >
      <Route
        path="/queues/:name/doc/:subject"
        component={({
          match: {
            params: { name, subject },
          },
        }) => {
          return (
            <div>
              WITH A DOC {name}/{subject}
            </div>
          );
        }}
      />

      {hasData && (
        <QueueDetailsInfo queue={queue} metrics={metrics} reload={reload} />
      )}
      {documents.hasData && (
        <QueueDocumentsList {...documents} onDocDisclose={onDocDisclose} />
      )}
      {logs.hasData && <QueueLogsList {...logs} />}
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </AppLayout>
  );
};

export default QueueDetailsView;
