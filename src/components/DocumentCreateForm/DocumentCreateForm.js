import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import JsonEditor from '../JsonEditor';
import useDocumentCreateForm from './use-document-create-form';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    minWidth: 600,
    maxWidth: 600,
  },
  body: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  payload: {
    marginTop: theme.spacing(2),
  },
  docs: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const DocumentCreateForm = ({ onSubmit, onCancel }) => {
  const classes = useStyles();
  const state = useDocumentCreateForm(onSubmit, onCancel);

  return (
    <form
      noValidate
      autoComplete="off"
      className={classes.root}
      onSubmit={state.handleSubmit}
    >
      <Typography variant="h6" component="h2">
        New Document
      </Typography>
      <Typography variant="subtitle1" component="p">
        Insert a new document in the queue
      </Typography>

      <div className={classes.body}>
        <ToggleButtonGroup
          variant="text"
          color="primary"
          size="small"
          aria-label="set the insert mode"
          value={state.usePush ? 'push' : 'append'}
          onChange={state.toggleMode}
        >
          <ToggleButton value={'append'}>append</ToggleButton>
          <ToggleButton value={'push'}>push</ToggleButton>
        </ToggleButtonGroup>

        <div className={classes.docs}>
          {state.usePush ? (
            <>
              <Typography variant="body2">
                Inserts a document with a <b>unique subject</b>.
              </Typography>
              <Typography variant="body2">
                You can also control the schedule of such a document by
                providind a <i>relative</i>
                or <i>absolute</i> <b>next iteration</b> date.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body2">
                Inserts a unique document at <i>point in time</i> <b>now</b>.
              </Typography>
              <Typography variant="body2">
                The document will receive a <b>universal unique ID</b>, and you
                can add custom information in its payload.
              </Typography>
            </>
          )}
        </div>

        {state.usePush && (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Subject"
              helperText="Max 50 chars."
              variant="outlined"
              size="small"
              value={state.subject}
              onChange={(evt) => state.setSubject(evt.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Next Iteration"
              helperText="+1s, +1 year, 2027-05-23"
              variant="outlined"
              size="small"
              className={classes.textField}
              value={state.nextIteration}
              onChange={(evt) => state.setNextIteration(evt.target.value)}
            />
          </>
        )}
        <JsonEditor
          label="Payload (JSON)"
          id="doc-payload"
          wrapperClass={classes.payload}
          value={state.payload}
          onChange={(evt, value) => state.setPayload(value)}
        />
      </div>

      <Box display="flex" justifyContent="flex-end" p={2}>
        {state.isDismissable && (
          <Button onClick={state.handleDismiss} color="primary">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </Box>
    </form>
  );
};

DocumentCreateForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

DocumentCreateForm.defaultProps = {
  onCancel: null,
};

export default DocumentCreateForm;
