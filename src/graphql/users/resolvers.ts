import { GraphQLError } from "graphql";
import UserService, { CreateUserPayload, GetUserTokenPayload } from "../../services/users.js"

const queries = {
    getUserToken: async(_: any, payload: GetUserTokenPayload) => {
        const resp = await UserService.getUserToken(payload)
        return resp;
    },
    getLoggedInUser: async(_:any, parameters: any, context: any) => {
        if(context && context.user) {
            return await UserService.getUserByEmail(context.user.email)
        }
        throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
        });
    }
}
const mutations = {
    createUser: async(_: any, payload: CreateUserPayload) => {
        const result = await UserService.createUser(payload)
        return result.id
    }
}

export const resolvers = { queries, mutations }