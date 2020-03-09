import React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useMutation } from 'react-relay/lib/relay-experimental';
import { TransactionCreateMutation, updater } from './TransactionCreateMutation';
import { useFormik, FormikProvider } from 'formik';
import * as yup from 'yup';
import { Button } from '../ui';

type Values = {
  isExpense: boolean;
  name: string;
  date: string;
};

export default function TransactionCreate({ onCancel }) {
  const [transactionCreate, isPending] = useMutation(TransactionCreateMutation);

  const onSubmit = (values: Values, formikAction) => {
    const config = {
      variables: {
        input: {
          isExpense: values.isExpense,
          name: values.name,
          date: values.date,
          kind: values.kind,
          kindModel: values.kindModel,
        },
      },
      updater,
      onCompleted: () => {
        formikAction.resetForm();
        onCancel();
      },
    };

    transactionCreate(config);
  };
  const formik = useFormik<Values>({
    initialValues: {
      isExpense: true,
      name: '',
      date: '',
      kind: '',
      kindModel: '',
    },
    validateOnMount: true,
    validateOnSchema: yup.object().shape({
      name: yup.string().required('Name is required'),
      password: yup.string().required('Password is required'),
    }),
    onSubmit,
  });

  const { values, setFieldValue, handleSubmit, isValid } = formik;

  return (
    <div>
      <FormikProvider value={formik}>
        <Dialog open={true} onClose={onCancel} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">New Transaction</DialogTitle>
          <DialogContent>
            <FormControl component="fieldset">
              <FormLabel component="legend">This transaction is:</FormLabel>
              <RadioGroup
                aria-label="expense/income"
                value={values.isExpense}
                onChange={e => setFieldValue('isExpense', Boolean(e.target.value))}
              >
                <FormControlLabel value={true} control={<Radio />} label="Expense" />
                <FormControlLabel value={false} control={<Radio />} label="Income" />
              </RadioGroup>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              label="name"
              value={values.name}
              onChange={e => setFieldValue('name', e.target.value)}
              fullWidth
            />
            <TextField label="date" value={values.date} onChange={e => setFieldValue('date', e.target.value)} />
            <TextField
              label="kind"
              value={values.kind}
              onChange={e => setFieldValue('kind', e.target.value)}
              fullWidth
            />
            <TextField
              label="kindModel"
              value={values.kindModel}
              onChange={e => setFieldValue('kindModel', e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </FormikProvider>
    </div>
  );
}
