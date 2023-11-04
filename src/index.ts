import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
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
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello i am a gql server',
                say: (parent, { name } : { name: string } ) => `Hey ${name} how are you`
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
    