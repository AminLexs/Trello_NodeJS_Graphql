var { ApolloServer, gql } = require("apollo-server-express");
var express = require('express');
var cors = require('cors');
var path = require('path');
const cookies = require("cookie-parser");

var resolvers = require('./routes/resolvers')
var authMidlleware = require('./_middleware/authentication');

const fs = require('fs');
const typeDefs = gql`${fs.readFileSync(__dirname.concat('/includes/gql/typDefs.graphql'), 'utf8')}`;


var server = async () => {
   var app = express();
   app.use(cors({
      origin: 'http://localhost:8083',
      credentials: true
   }))
   const corsOptions = {
      origin: "http://localhost:8083",
      credentials: true
    };
   const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,

      context : authMidlleware.checkTokenQL
   });
   
   apolloServer.applyMiddleware({ app, cors: corsOptions});

   app.use(express.static('../public'));

   app.use(express.static(path.join(__dirname, "..", "build")));
   app.use(express.json());
   app.use(cookies());

   app.use("/graphql",cookies())

   app.listen(8082, function () {
      console.log("Example app listening at 8082")
   });
}

server();