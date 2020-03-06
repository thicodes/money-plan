import { graphql } from 'react-relay';

export const UserRegisterWithEmail = graphql`
  mutation UserRegisterWithEmailMutation($input: UserRegisterWithEmailInput!) {
    UserRegisterWithEmail(input: $input) {
      token
      error
      me {
        id
        name
      }
    }
  }
`;
