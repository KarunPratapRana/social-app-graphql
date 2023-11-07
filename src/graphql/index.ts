import { ApolloServer } from '@apollo/server';
import { User } from './users/index.js'
async function createApolloGraphqlServer() {
    //create graphQL server
    const gqlServer = new ApolloServer({
        typeDefs: `
            ${User.typeDefs}
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
        },
    })

    //start the gql server
    await gqlServer.start()

    return gqlServer;
}

export default createApolloGraphqlServer;