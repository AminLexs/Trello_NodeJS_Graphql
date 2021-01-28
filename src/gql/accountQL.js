import { gql } from '@apollo/client';

const login = gql`
    mutation LoginMutation($user: UserInput) {
        loginMutation: login(user: $user){
            code
        }
    }`

const logout = gql`
    query LogoutQuery{
        logutQuery: logout{
            code
        }
    }`

const register = gql`    
    mutation RegisterMutation($user: UserInput) {
        registerMutation: register(user: $user){
            code
        }
    }`
export { login, register, logout };