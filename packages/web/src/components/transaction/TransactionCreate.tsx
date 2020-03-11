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
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { useMutation } from 'react-relay/lib/relay-experimental';
import { graphql, useFragment } from 'react-relay/hooks';
import { TransactionCreate, updater } from './TransactionCreateMutation';
import { useFormik, FormikProvider } from 'formik';
import * as yup from 'yup';
import { Button } from '../ui';

import { TransactionCreateMutation } from './__generated__/TransactionCreateMutation.graphql'
import { TransactionCreate_query$key } from './__generated__/TransactionCreate_query.graphql'

type Props = {
  query: any;
  onCancel: () => void
}

type Values = {
  isExpense: boolean;
  name: string;
  date: string;
};

export default function TransactionCreate({ query, onCancel }: Props) {
  const [transactionCreate, isPending] = useMutation<TransactionCreateMutation>(TransactionCreate);

  const { transactionsByKind } = useFragment(
    graphql`
      fragment TransactionCreate_query on Query {
        transactionsByKind {
          edges {
            node {
              id
              kindModel
              kind {
                ... on AccountConnection {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
                ... on CreditCardConnection {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    query,
  );

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

  const transactionsKindMapEdges = (transactionsByKind?.edges ?? []).map(edge => ({
    ...edge.node,
    kind: edge.node.kind.edges.map(kindEdges => kindEdges.node),
  }));
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
            <TextField
              label="date"
              type="date"
              value={values.date}
              onChange={e => setFieldValue('date', e.target.value)}
            />
            <FormControl>
              <InputLabel htmlFor="grouped-select">Grouping</InputLabel>
              <Select defaultValue="" onChange={e => setFieldValue('kind', e.target.value)} input={<Input id="grouped-select" />}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {transactionsKindMapEdges.map(({ kindModel, kind }, idx) => (
                  <span key={idx}>
                    <ListSubheader>{kindModel}</ListSubheader>
                    {kind.map(({id, name}) => (
                      <MenuItem value={id} key={id}>{name}</MenuItem>
                    ))}
                  </span>
                ))}
              </Select>
            </FormControl>
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
