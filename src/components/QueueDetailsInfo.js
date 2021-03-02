import React from 'react';

const QueueDetailsInfo = ({ queue, metrics, reload }) => {
  const getMetric = (key) => (metrics[key] ? metrics[key].value : 0);
  const onReload = () => reload({ keepData: true });

  return (
    <div>
      <b>Info:</b>
      <br />
      Status: {queue.isActive ? 'active' : 'paused'}; Max Attempts:{' '}
      {queue.maxAttempts}; Logs Retention: {queue.logsRetention};
      <br />
      Count: {getMetric('cnt')}; Pending: {getMetric('pnd')}; Errors:{' '}
      {getMetric('err')}
      <br />
      <button onClick={onReload}>reload</button>
    </div>
  );
};

export default QueueDetailsInfo;
