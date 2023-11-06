import { expressMiddleware } from '@apollo/server/express4';
// import cors from 'cors';
import express from 'express';
import createApolloGraphqlServer from './graphql/index.js';
const app = express();

const PORT = process.env.PORT || 8000;

(async() => {
    app.get('/', (req, res) => {
        res.json({ message: "Server is up and running"});
    })

    app.use('/graphql', express.json(), expressMiddleware(await createApolloGraphqlServer()))

    app.listen(PORT, () => {
        console.log("server is running at port ", PORT)
    })
})()
    