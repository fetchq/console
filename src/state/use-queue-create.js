import { useAxios } from './use-axios';

export const useQueueCreate = () => {
  const { called, loading, data, error, ...axios } = useAxios();

  const create = (data) => {
    if (!data.name) {
      throw new Error('Queue name is required');
    }

    return axios.post(`/api/v1/queues`, data);
  };

  return {
    create,
  };
};
