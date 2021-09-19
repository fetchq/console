import { useState } from 'react';

const useDocumentCreateForm = (onSubmit, onCancel) => {
  const [useAppend, setUseAppend] = useState(true);
  const [subject, setSubject] = useState('');
  const [nextIteration, setNextIteration] = useState('');
  const [payload, setPayload] = useState({});

  const isDismissable = !!onCancel;
  const usePush = !useAppend;
  const toggleMode = () => setUseAppend(!useAppend);

  const resetValues = () => {
    setSubject('');
    setPayload({});
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const data = useAppend
      ? {
          mode: 'append',
          payload,
        }
      : {
          mode: 'push',
          subject,
          next_iteration: nextIteration,
          payload,
        };

    try {
      await onSubmit(data);
      resetValues();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDismiss = () => {
    resetValues();
    onCancel();
  };

  return {
    useAppend,
    usePush,
    isDismissable,
    subject,
    nextIteration,
    payload,
    toggleMode,
    setSubject,
    setNextIteration,
    setPayload,
    handleSubmit,
    handleDismiss,
  };
};

export default useDocumentCreateForm;
