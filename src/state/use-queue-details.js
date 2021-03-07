import { useGet } from './use-get';
import { makeQueueDetails, makeQueueMetrics } from '../data-types/queue';
import { makeErrorListItem } from '../data-types/errors';

export const useQueueDetails = (name) => {
  const [info, { fetch: reload }] = useGet(`/api/v1/queues/${name}`);

  const hasData = Boolean(info.data);
  const hasErrors = Boolean(info.errors);

  // Build data properties:
  const errors = hasErrors ? info.errors.map(makeErrorListItem) : null;
  const queue = hasData
    ? makeQueueDetails(info.data.queue, info.data.metrics)
    : {};

  const metrics = hasData ? makeQueueMetrics(info.data.metrics) : [];

  return {
    isLoading: info.isLoading,
    hasData,
    hasErrors,
    errors,
    queue,
    metrics,
    reload,
  };
};
