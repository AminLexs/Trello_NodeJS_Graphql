import { client } from '../components/root'
import {login, register, logout} from "../gql/accountQL"

const AccountAction = {

    loginQL(_login, password){
        let user = {
            login : _login,
            password
        }
        return client.mutate({
            mutation: login,
            variables: { user : user }
        })
            .then(res => {
                console.log(res)
                return res.data.loginMutation.code;
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 2))
            });
    },

    registerQL(login, password){
        let user = {
            login,
            password
        }
        return client.mutate({
            mutation: register,
            variables: { user : user }
        })
            .then(res => {
                console.log(res)
                return res.data.registerMutation.code;
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 2))
            });
    },

    logoutQL(){
        client.query({
            query: logout,
        })
            .then(res => {
                console.log(res)
                return res.data.registerMutation.code;
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 2))
            });
    }
}

export default AccountAction;

