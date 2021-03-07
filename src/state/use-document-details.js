import { useGet } from './use-get';
import { makeDocumentDetails } from '../data-types/document';
import { makeErrorListItem } from '../data-types/errors';

export const useDocumentDetails = (queue, subject) => {
  const [
    info,
    { fetch: reload },
  ] = useGet(`/api/v1/queues/${queue}/docs/${subject}`, { keepData: true });

  const hasData = Boolean(info.data);
  const hasErrors = Boolean(info.errors);

  // Build data properties:
  const errors = hasErrors ? info.errors.map(makeErrorListItem) : null;
  const doc = hasData ? makeDocumentDetails(info.data.doc) : {};
  const nextDoc = hasData ? info.data.nextDoc : null;
  const prevDoc = hasData ? info.data.prevDoc : null;

  return {
    isLoading: info.isLoading,
    hasData,
    hasErrors,
    errors,
    doc,
    nextDoc,
    prevDoc,
    reload,
  };
};
