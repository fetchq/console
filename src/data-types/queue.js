import PropTypes from 'prop-types';

export const queueShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  maxAttempts: PropTypes.number.isRequired,
  logsRetention: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
  cnt: PropTypes.number.isRequired,
  pnd: PropTypes.number.isRequired,
  pln: PropTypes.number.isRequired,
  act: PropTypes.number.isRequired,
  cpl: PropTypes.number.isRequired,
  kll: PropTypes.number.isRequired,
  drp: PropTypes.number.isRequired,
  pkd: PropTypes.number.isRequired,
  prc: PropTypes.number.isRequired,
  res: PropTypes.number.isRequired,
  orp: PropTypes.number.isRequired,
  err: PropTypes.number.isRequired,
});

export const makeQueueMetrics = (rawMetrics) =>
  rawMetrics.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.metric]: {
        value: Number(curr.current_value),
        updatedAt: new Date(curr.last_update),
      },
    };
  }, {});

export const getMetricCurrentValue = (rawItems, name) => {
  const metric = rawItems.find((item) => item.metric === name);
  return metric ? metric.current_value : 0;
};

export const makeQueueListItem = (rawData) => {
  const createdAt = new Date(rawData.created_at);

  return {
    id: Number(rawData.id),
    name: String(rawData.name),
    isActive: Boolean(rawData.is_active),
    maxAttempts: Number(rawData.max_attempts),
    logsRetention: String(rawData.logs_retention),
    cnt: Number(rawData.cnt),
    pnd: Number(rawData.pnd),
    pln: Number(rawData.pln),
    act: Number(rawData.act),
    cpl: Number(rawData.cpl),
    kll: Number(rawData.kll),
    drp: Number(rawData.drp),
    pkd: Number(rawData.pkd),
    prc: Number(rawData.prc),
    res: Number(rawData.res),
    orp: Number(rawData.orp),
    err: Number(rawData.err),
    createdAt,
  };
};

export const makeQueueDetails = (rawData, rawMetrics) => {
  return {
    ...makeQueueListItem(rawData),
    cnt: getMetricCurrentValue(rawMetrics, 'cnt'),
    pnd: getMetricCurrentValue(rawMetrics, 'pnd'),
    pln: getMetricCurrentValue(rawMetrics, 'pln'),
    act: getMetricCurrentValue(rawMetrics, 'act'),
    cpl: getMetricCurrentValue(rawMetrics, 'cpl'),
    kll: getMetricCurrentValue(rawMetrics, 'kll'),
    drp: getMetricCurrentValue(rawMetrics, 'drp'),
    pkd: getMetricCurrentValue(rawMetrics, 'pkd'),
    prc: getMetricCurrentValue(rawMetrics, 'prc'),
    res: getMetricCurrentValue(rawMetrics, 'res'),
    orp: getMetricCurrentValue(rawMetrics, 'orp'),
    err: getMetricCurrentValue(rawMetrics, 'err'),
  };
};
