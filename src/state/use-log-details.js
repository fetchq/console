import { useGet } from './use-get';
import { makeLogDetails } from '../data-types/log';
import { makeErrorListItem } from '../data-types/errors';

export const useLogDetails = (queue, id) => {
  const [info, { fetch: reload }] = useGet(
    `/api/v1/queues/${queue}/logs/${id}`,
    { keepData: true },
  );

  const hasData = Boolean(info.data);
  const hasErrors = Boolean(info.errors);

  // Build data properties:
  const errors = hasErrors ? info.errors.map(makeErrorListItem) : null;
  const log = hasData ? makeLogDetails(info.data.log) : {};
  const nextLog = hasData ? info.data.nextLog : null;
  const prevLog = hasData ? info.data.prevLog : null;

  return {
    isLoading: info.isLoading,
    hasData,
    hasErrors,
    errors,
    log,
    nextLog,
    prevLog,
    reload,
  };
};
