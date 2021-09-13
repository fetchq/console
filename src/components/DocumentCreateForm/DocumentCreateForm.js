import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Switch from '@material-ui/core/Switch';

import JsonEditor from '../JsonEditor';
import useDocumentCreateForm from './use-document-create-form';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  payload: {
    marginTop: theme.spacing(2),
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
      <Card>
        <CardHeader
          title="New Document"
          subheader="Push or append a new document in the queue"
        />
        <Divider />
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={state.useAppend}
                onChange={state.toggleMode}
                name="checkedB"
                color="primary"
              />
            }
            label={state.useAppend ? 'mode: Append' : 'mode: Push'}
          />
          {state.usePush && (
            <TextField
              fullWidth
              margin="normal"
              label="Subject"
              variant="outlined"
              size="small"
              value={state.subject}
              onChange={(evt) => state.setSubject(evt.target.value)}
            />
          )}
          <JsonEditor
            label="Payload (JSON)"
            id="doc-payload"
            wrapperClass={classes.payload}
            value={state.payload}
            onChange={(evt, value) => state.setPayload(value)}
          />
        </CardContent>
        <Divider />
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
      </Card>
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
