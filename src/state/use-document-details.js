import { useGet } from './use-get';
import { makeDocumentDetails } from '../data-types/document';

export const useDocumentDetails = (queue, subject) => {
  const [info, { fetch: reload }] = useGet(
    `/api/v1/queues/${queue}/docs/${subject}`,
  );

  const hasData = Boolean(info.data);
  const doc = hasData ? makeDocumentDetails(info.data.doc) : {};
  const nextDoc = hasData ? info.data.nextDoc : null;
  const prevDoc = hasData ? info.data.prevDoc : null;

  return {
    isLoading: info.isLoading,
    hasData,
    doc,
    nextDoc,
    prevDoc,
    reload,
  };
};
