import React from 'react';
import AppLayout from '../layouts/AppLayout';
import { useQueues } from '../state/use-queues';
import QueueListTable from '../components/QueueListTable';

const Dashboard = () => {
  const queues = useQueues();
  console.log(queues);
  return (
    <AppLayout>
      <QueueListTable items={queues.items} />
    </AppLayout>
  );
};

export default Dashboard;
