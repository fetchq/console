import PropTypes from 'prop-types';

export const queueShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  maxAttempts: PropTypes.number.isRequired,
  logsRetention: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
});

export const makeQueue = (data) => {
  const createdAt = new Date(data.created_at);

  return {
    id: Number(data.id),
    name: String(data.name),
    isActive: Boolean(data.is_active),
    maxAttempts: Number(data.max_attempts),
    logsRetention: String(data.logs_retention),
    createdAt,
  };
};
