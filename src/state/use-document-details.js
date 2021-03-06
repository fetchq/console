import { useGet } from './use-get';
import { makeDocumentDetails } from '../data-types/document';

export const useDocumentDetails = (queue, subject) => {
  const [info, { fetch: reload }] = useGet(
    `/api/v1/queues/${queue}/doc/${subject}`,
  );

  const hasData = Boolean(info.data);
  const doc = hasData ? makeDocumentDetails(info.data.doc) : {};

  return {
    isLoading: info.isLoading,
    hasData,
    doc,
    reload,
  };
};
