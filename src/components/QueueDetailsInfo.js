// import React from 'react';
import PropTypes from 'prop-types';

const deleteMsg = (value) =>
  `You will delete the queue, its documents, logs and metrics.
THIS OPERATION IS PERMANENT AND CAN NOT BE UNDONE!

In order to proceed, please type "${value}" in the following input:
`;

const QueueDetailsInfo = ({ queue, metrics, onReload, onDelete }) => {
  const getMetric = (key) => (metrics[key] ? metrics[key].value : 0);
  const reloadHandler = () => onReload({ keepData: true });
  const dropHandler = () => {
    const expectedValue = queue.name.toUpperCase();
    const typedName = prompt(deleteMsg(expectedValue));
    if (expectedValue === typedName) {
      onDelete(queue);
    } else {
      alert(`The queue name doesn't match`);
    }
  };

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
      <button onClick={reloadHandler}>reload</button>
      <button onClick={dropHandler}>drop queue</button>
    </div>
  );
};

QueueDetailsInfo.propTypes = {
  queue: PropTypes.shape({
    name: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isActive,
    logsRetention: PropTypes.string.isRequired,
    cnt: PropTypes.number.isRequired,
    pnd: PropTypes.number.isRequired,
    err: PropTypes.number.isRequired,
  }).isRequired,
  onReload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default QueueDetailsInfo;
