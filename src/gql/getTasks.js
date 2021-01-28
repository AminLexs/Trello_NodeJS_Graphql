
import { gql } from '@apollo/client';

export const getTasks = gql`
query GetQuery($status: String) {
  getQuery: getTasks(status: $status){
    code
    obj{
      id
      status
      fileName
      deathDate
      birthDate
      name
    }
  }
}
`;

