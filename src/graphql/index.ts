import { ApolloServer } from '@apollo/server';
// import { prismaClient } from '../lib/db.js'; //need to this issue, so that ts automatically compiles into js
import { User } from './users/index.js'
async function createApolloGraphqlServer() {
    //create graphQL server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                ${User.queries}
            }
            type Mutation {
                ${User.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
            Mutation: {
                ...User.resolvers.mutations
            }
        }
    })

    //start the gql server
    await gqlServer.start()

    return gqlServer;
}

export default createApolloGraphqlServer;