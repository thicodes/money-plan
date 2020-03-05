import React from 'react';
import { Flex, Box } from 'rebass';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-relay/lib/relay-experimental';
import TextField from '@material-ui/core/TextField';
import { useFormik, FormikProvider } from 'formik';
import * as yup from 'yup';
import { graphql } from 'react-relay';
import { Card, CardActions, Button } from '../ui';
import { UserRegisterWithEmailMutation } from './__generated__/UserRegisterWithEmailMutation.graphql';
import { UserRegisterWithEmail } from './UserRegisterWithEmailMutation';
import Link from '../../routing/Link';
import { useHistory } from '../../routing/useHistory';
import { updateToken } from './security';

type Values = {
  name: string;
  email: string;
  password: string;
};

function SignUp() {
  const [userRegisterWithEmail, isPending] = useMutation<UserRegisterWithEmailMutation>(UserRegisterWithEmail);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const history = useHistory();

  const onSubmit = (values: Values) => {
    closeSnackbar();

    const config = {
      variables: {
        input: {
          name: values.name,
          email: values.email,
          password: values.password,
        },
      },
      onCompleted: ({ UserRegisterWithEmail }) => {
        if (UserRegisterWithEmail.error) {
          console.log(UserRegisterWithEmail.error);
          enqueueSnackbar(UserRegisterWithEmail.error);
          return;
        }
        // enqueueSnackbar(UserRegisterWithEmail.success);
        updateToken(UserRegisterWithEmail.token);

        history.push('/');
      },
    };

    userRegisterWithEmail(config);
  };

  const formik = useFormik<Values>({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validateOnMount: true,
    validateOnSchema: yup.object().shape({
      name: yup.string().required('Name is required'),
      email: yup
        .string()
        .email()
        .required('Email is required'),
      password: yup.string().required('Password is required'),
    }),
    onSubmit,
  });

  const { values, setFieldValue, handleSubmit, isValid } = formik;

  const isSubmitDisabled = !isValid || isPending;

  return (
    <FormikProvider value={formik}>
      <Card mb="10px" p="10px" flex={1}>
        <Flex flexDirection="column">
          <div>SignUp</div>
          <TextField label="name" value={values.name} onChange={e => setFieldValue('name', e.target.value)} />
          <TextField label="email" value={values.email} onChange={e => setFieldValue('email', e.target.value)} />
          <TextField
            label="password"
            value={values.password}
            onChange={e => setFieldValue('password', e.target.value)}
            type="password"
          />
          <CardActions justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              mt="10px"
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              Sign Up
            </Button>
            <Link to={'/auth/login'}>Sign in insted</Link>
          </CardActions>
        </Flex>
      </Card>
    </FormikProvider>
  );
}

export default SignUp;
