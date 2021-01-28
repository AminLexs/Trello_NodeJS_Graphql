
import { gql } from '@apollo/client';

export const login = gql`
mutation{
    login(user:{
        login:"baka"
        password:"12345678"
    }){
        code
    }
}
`;