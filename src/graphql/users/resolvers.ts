import UserService, { CreateUserPayload, GetUserTokenPayload } from "../../services/users.js"

const queries = {
    getUserToken: async(_: any, payload: GetUserTokenPayload) => {
        const resp = await UserService.getUserToken(payload)
        return resp;
    }
}
const mutations = {
    createUser: async(_: any, payload: CreateUserPayload) => {
        const result = await UserService.createUser(payload)
        return result.id
    }
}

export const resolvers = { queries, mutations }