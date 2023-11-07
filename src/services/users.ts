import { createHmac, randomBytes } from 'node:crypto';
import { prismaClient } from '../lib/db.js';
import JWT from "jsonwebtoken"
import { GraphQLError } from 'graphql';
const TOKEN = "c449c786743b9b502a43b3374c0157c2"

export interface CreateUserPayload {
    firstName: string,
    lastName?: string,
    email: string,
    password: string 
}

export interface GetUserTokenPayload {
    email: string,
    password: string 
}

class UserService {
    private static generateHashPassword(salt: string, password: string) {
        return createHmac('sha256', salt)
        .update(password)
        .digest("hex")
    }

    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload
        const salt = randomBytes(16).toString("hex");
        const hashPassword = UserService.generateHashPassword(salt, password)

        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                salt,
                password: hashPassword
            }
        })

    }

    public static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email }})
    }

    public static async decodeJWTToken(token: string) {
        return JWT.verify(token, TOKEN)
    }

    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;
        const user = await UserService.getUserByEmail(email)
        if(!user) throw new Error("User not found!")
        const userSalt = user.salt;
        const hashPassword = UserService.generateHashPassword(userSalt, password)
        if(hashPassword == user.password) {
            return JWT.sign({
                id: user.id,
                email: user.email
            }, TOKEN)
        } else {
            throw new GraphQLError('Password is incorrect!', {
                extensions: {
                  code: 'BAD_REQUEST',
                  http: { status: 400 },
                },
            });
        }
    }
}

export default UserService