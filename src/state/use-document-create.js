import { useState } from 'react';
import { useAxios } from './use-axios';

export const useDocumentCreate = (queueName) => {
  const [open, setOpen] = useState(false);
  const { called, loading, data, error, ...axios } = useAxios();

  const openDialog = () => setOpen(true);
  const onCancel = () => setOpen(false);

  const onSubmit = async (data) => {
    const res = await axios.post(`/api/v1/queues/${queueName}/docs`, {
      subject: data.subject,
    });

    console.log('input:', data);
    console.log('output:', res.data);

    alert('The document was correctly added into the queue!');
    setOpen(false);
  };

  return {
    open,
    onSubmit,
    onCancel,
    openDialog,
  };
};
