import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { useMutation } from 'react-relay/lib/relay-experimental';
import { graphql, useFragment, usePreloadedQuery } from 'react-relay/hooks';
import { TransactionCreate, updater } from './TransactionCreateMutation';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Button, Spinner } from '../ui';
import TextField from '../form/TextField';
import { useHistory } from '../../routing/useHistory';

import { TransactionCreateMutation } from './__generated__/TransactionCreateMutation.graphql';
import { TransactionComposerDialogQuery } from './__generated__/TransactionComposerDialogQuery.graphql';

type Props = {
  prepared: {
    transactionComposerDialogQuery: any;
  };
};

type Values = {
  expenseOrIncome: 'EXPENSE' | 'INCOME' | null;
  name: string;
  date: string;
};

function TransactionComposerDialog({ prepared }: Props) {
  const [transactionCreate, isPending] = useMutation<TransactionCreateMutation>(TransactionCreate);

  const history = useHistory();

  const onClose = () => {
    history.push('/transactions');
  }

  // const [isOpenTransactionComposer, setIsOpenTransactionComposer] = React.useState(false);
  const { transactionsByKind } = usePreloadedQuery<TransactionComposerDialogQuery>(
    graphql`
      query TransactionComposerDialogQuery {
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
    prepared.transactionComposerDialogQuery,
  );

  const onSubmit = (values: Values, formikAction) => {
    const config = {
      variables: {
        input: {
          expenseOrIncome: values.expenseOrIncome,
          name: values.name,
          date: new Date(values.date),
          kind: values.kind,
          kindModel: values.kindModel,
        },
      },
      updater,
      onCompleted: () => {
        formikAction.resetForm();
        onClose();
      },
    };

    transactionCreate(config);
  };
  const initialValues = {
    expenseOrIncome: '',
    name: '',
    date: '',
    kind: '',
    kindModel: '',
  };
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    password: yup.string().required('Password is required'),
  });

  const transactionsKindMapEdges = (transactionsByKind?.edges ?? []).map(edge => ({
    ...edge.node,
    kind: edge.node.kind.edges.map(kindEdges => kindEdges.node),
  }));
  return (
    <Dialog open onBackdropClick={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">New Transaction</DialogTitle>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({setFieldValue, values, handleSubmit, handleChange}) => (
          <Form>
            <DialogContent>
              <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">This transaction is:</FormLabel>
                <RadioGroup
                  aria-label="expense/income"
                  name="expenseOrIncome"
                  value={values.expenseOrIncome}
                  defaultValue="EXPENSE"
                  onChange={handleChange}
                >
                  <FormControlLabel value="EXPENSE" control={<Radio />} label="Expense" />
                  <FormControlLabel value="INCOME" control={<Radio />} label="Income" />
                </RadioGroup>
              </FormControl>
              <TextField
                autoFocus
                label="name"
                name="name"
                onChange={handleChange}
                value={values.name}
                fullWidth
              />

              <TextField
                label="Date"
                type="date"
                name="date"
                onChange={handleChange}
                value={values.date}
                margin="dense"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <FormControl style={{minWidth: 200}}>
                <InputLabel htmlFor="grouped-select">Account/Card</InputLabel>
                <Select
                  defaultValue=""
                  onChange={e => {
                      const selectedId = e.target.value;
                      setFieldValue('kind', selectedId)
                      if (selectedId) {
                        const getParentFromChildren = transactionsKindMapEdges.find(transaction => transaction.kind.find(kind => kind.id === selectedId))
                        setFieldValue('kindModel', getParentFromChildren.kindModel)
                      } else {
                        setFieldValue('kindModel', "")
                      }
                    }
                  }
                  input={<Input id="grouped-select" />}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {transactionsKindMapEdges.map(({ kindModel, kind }) => {
                    return [
                      <ListSubheader>{kindModel}</ListSubheader>,
                      kind.map(({id, name}) => (
                        <MenuItem value={id} key={id}>{name}</MenuItem>
                      ))
                    ]
                  })}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

const SuspenseTransactionComposerDialog = (props) => <React.Suspense fallback={<Spinner />}><TransactionComposerDialog {...props} /></React.Suspense>

export default SuspenseTransactionComposerDialog;