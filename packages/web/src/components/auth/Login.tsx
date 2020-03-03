import React from 'react';
import { Flex, Box } from 'rebass';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-relay/lib/relay-experimental';
import TextField from '@material-ui/core/TextField';
import { useFormik, FormikProvider } from 'formik';
import * as yup from 'yup';
import { graphql } from 'react-relay';
import { Card, CardActions, Button } from '../ui';
import { UserLoginWithEmailMutation } from './__generated__/UserLoginWithEmailMutation.graphql';
import { UserLoginWithEmail } from './UserLoginWithEmailMutation';
import Link from '../../routing/Link';
import { useHistory } from '../../routing/useHistory';
import { updateToken } from './security';

type Values = {
  email: string;
  password: string;
};

function Login() {
  const [userLoginWithEmail, isPending] = useMutation(UserLoginWithEmail);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const history = useHistory();

  const onSubmit = (values: Values) => {
    closeSnackbar();

    const config = {
      variables: {
        input: {
          email: values.email,
          password: values.password,
        },
      },
      onCompleted: ({ UserLoginWithEmail }) => {
        if (UserLoginWithEmail.error) {
          enqueueSnackbar(UserLoginWithEmail.error);
          return;
        }
        enqueueSnackbar('Você está logado');
        updateToken(UserLoginWithEmail.token);
        history.push('/');
      },
    };

    userLoginWithEmail(config);
  };

  const formik = useFormik<Values>({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnMount: true,
    validateOnSchema: yup.object().shape({
      email: yup.string().required('Email is required'),
      password: yup.string().required('Password is required'),
    }),
    onSubmit,
  });

  const { values, setFieldValue, handleSubmit, isValid } = formik;

  const isSubmitDisabled = !isValid || isPending;

  return (
    <FormikProvider value={formik}>
      <Box width={'450px'} m={'0 auto'} pt={'50px'}>
        <Card flex={1}>
          <Flex flexDirection="column">
            <span>Login</span>
            <TextField label="email" value={values.email} onChange={e => setFieldValue('email', e.target.value)} />
            <TextField
              label="password"
              type="password"
              value={values.password}
              onChange={e => setFieldValue('password', e.target.value)}
            />
            <CardActions>
              <Link to={'/auth/signUp'}>Create an account</Link>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              >
                Login
              </Button>
            </CardActions>
          </Flex>
        </Card>
      </Box>
    </FormikProvider>
  );
}

export default Login;
