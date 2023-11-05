import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
// import cors from 'cors';
import express from 'express';
import { prismaClient } from './lib/db.js'; //need to this issue, so that ts automatically compiles into js
const app = express();

const PORT = process.env.PORT || 8000;

(async() => {
    //create graphQL server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello i am a gql server',
                say: (parent, { name } : { name: string } ) => `Hey ${name} how are you`
            },
            Mutation: {
                createUser: async(_, 
                    { 
                        firstName, 
                        lastName, 
                        email, 
                        password 
                    }: { 
                        firstName: string; 
                        lastName: string;
                        email: string;
                        password: string
                    }) => {
                        await prismaClient.user.create({
                            data: {
                                firstName,
                                lastName,
                                email,
                                password,
                                salt: 'random_salt'
                            }
                        });
                        return true
                    }
            }
        }
    })

    //start the gql server
    await gqlServer.start()
    app.get('/', (req, res) => {
        res.json({ message: "Server is up and running"});
    })

    app.use('/graphql', express.json(), expressMiddleware(gqlServer))

    app.listen(PORT, () => {
        console.log("server is running at port ", PORT)
    })
})()
    