import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

import DocumentCreateForm from '../../DocumentCreateForm';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DocumentCreateDialog = ({ open, ...props }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      fullWidth
      maxWidth={'sm'}
      onClose={() => props.onCancel && props.onCancel()}
    >
      <DocumentCreateForm {...props} />
    </Dialog>
  );
};

DocumentCreateDialog.propTypes = {
  open: PropTypes.bool,
};

DocumentCreateDialog.defaultProps = {
  open: false,
};

export default DocumentCreateDialog;
