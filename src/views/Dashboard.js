import React from 'react';
import { useHistory } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { useQueues } from '../state/use-queues';
import QueueListTable from '../components/QueueListTable';

const Dashboard = () => {
  const history = useHistory();
  const queues = useQueues();

  const onDisclose = ({ name }) => {
    history.push(`/queues/${name}`);
  };

  return (
    <AppLayout>
      <QueueListTable items={queues.items} onDisclose={onDisclose} />
    </AppLayout>
  );
};

export default Dashboard;
