import { useState } from 'react';

const useDocumentCreateForm = (onSubmit, onCancel) => {
  const [useAppend, setUseAppend] = useState(false);
  const [payload, setPayload] = useState({});

  const isDismissable = !!onCancel;
  const usePush = !useAppend;
  const toggleMode = () => setUseAppend(!useAppend);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const data = useAppend
      ? {
          mode: 'append',
          payload: payload.value,
        }
      : {
          mode: 'push',
          subject: evt.target['doc-subject'].value,
          payload: payload,
        };

    try {
      await onSubmit(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDismiss = () => {
    setPayload({});
    onCancel();
  };

  return {
    useAppend,
    usePush,
    isDismissable,
    payload,
    toggleMode,
    setUseAppend,
    setPayload,
    handleSubmit,
    handleDismiss,
  };
};

export default useDocumentCreateForm;
