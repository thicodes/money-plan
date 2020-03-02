import React from 'react';
import { Flex, Box } from 'rebass';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-relay';
import TextField from '@material-ui/core/TextField';
import { useFormik, FormikProvider } from 'formik';
import * as yup from 'yup';
import { Card, CardActions, Button } from '../ui';
import Link from '../../routing/Link';

type Values = {
  email: string;
  password: string;
};

function Login() {
  const [userLoginWithEmail, isPending] = useMutation(UserLoginWithEmail);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onSubmit = (values: Values) => {
    closeSnackbar();

    const config = {
      variables: {
        input: {
          email: values.email,
          password: values.password,
        },
      },
    };
  };

  const formik = useFormik<Values>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit,
  });

  const isSubmitDisabled = false;
  // const isSubmitDisabled = !isValid || isPeding;

  const { handleSubmit, isValid } = formik;

  return (
    <FormikProvider value={formik}>
      <Box width={'450px'} m={'0 auto'} pt={'50px'}>
        <Card flex={1}>
          <Flex flexDirection="column">
            <span>Login</span>
            <TextField name="email" label="email" />
            <TextField name="password" label="password" type="password" />
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
