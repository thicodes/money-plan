import { graphql } from 'react-relay';

export const UserLoginWithEmail = graphql`
  mutation UserLoginWithEmailMutation($input: UserLoginWithEmailInput!) {
    UserLoginWithEmail(input: $input) {
      token
      error
    }
  }
`;
