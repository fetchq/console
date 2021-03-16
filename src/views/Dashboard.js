import React from 'react';
import { useHistory } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { useQueues } from '../state/use-queues';
import { useQueueCreate } from '../state/use-queue-create';
import QueueListTable from '../components/QueueListTable';
import QueueCreateForm from '../components/QueueCreateForm';

const Dashboard = () => {
  const history = useHistory();
  const queues = useQueues();
  const { create } = useQueueCreate();

  const onDisclose = ({ name }) => {
    history.push(`/queues/${name}`);
  };

  const onSubmit = (data) => create(data).then(() => queues.reload());

  return (
    <AppLayout>
      <QueueListTable items={queues.items} onDisclose={onDisclose} />
      <QueueCreateForm onSubmit={onSubmit} />
    </AppLayout>
  );
};

export default Dashboard;
