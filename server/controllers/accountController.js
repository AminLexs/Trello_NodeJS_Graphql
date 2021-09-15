require('dotenv').config();

const QUERY = require('../includes/queries');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


exports.registerQL = async function(userInfo){
    let user =  await QUERY.findUserByLogin(userInfo.login);

    if(user[0]){
        return null
    }

    try{

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userInfo.password, salt);
        
        if(await QUERY.addNewUser(userInfo.login, hashedPassword, salt)){
            return createToken(userInfo.login);;
        }  

    }catch{ 
        return null;
    }

    return null;
}

exports.loginQL = async function(userInfo){
    let user = await QUERY.findUserByLogin(userInfo.login);

    if(user && user[0]){
        const hash = await bcrypt.hash(userInfo.password, user[0].salt);
        if(!user[0].password.localeCompare(hash)){
            const token = createToken(user[0].login) 
            return token;
        }
    }
    return null  
}

function createToken(login){
    return jwt.sign(login, process.env.KEY);
}