import { useState } from 'react';
import { useAxios } from './use-axios';

export const useDocumentCreate = ({
  queueName,
  onDocumentCreated = () => {},
  onFormCanceled = () => {},
}) => {
  const { called, loading, data, error, ...axios } = useAxios();

  const onCancel = () => onFormCanceled();
  const onSubmit = async (data) => {
    const res = await axios.post(`/api/v1/queues/${queueName}/docs`, {
      subject: data.subject,
      next_iteration: data.next_iteration,
      payload: data.payload,
    });

    onDocumentCreated(res.data.data);
  };

  return {
    onSubmit,
    onCancel,
  };
};
