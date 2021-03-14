import { useAxios } from './use-axios';

export const useQueueDrop = ({
  onSuccess = () => {},
  onError = () => {},
} = {}) => {
  const { called, loading, data, error, ...axios } = useAxios();

  const drop = ({ name }) =>
    axios.delete(`/api/v1/queues/${name}`).then(onSuccess).catch(onError);

  return { called, loading, data, error, drop };
};
