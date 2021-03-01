import { useGet } from './use-get';
import { makeQueueDetails, makeQueueMetrics } from '../data-types/queue';

export const useQueueDetails = (name) => {
  const [info] = useGet(`/api/v1/queues/${name}`);

  const hasData = Boolean(info.data);
  const queue = hasData
    ? makeQueueDetails(info.data.queue, info.data.metrics)
    : {};

  const metrics = hasData ? makeQueueMetrics(info.data.metrics) : [];

  return {
    isLoading: info.isLoading,
    hasData,
    queue,
    metrics,
  };
};
