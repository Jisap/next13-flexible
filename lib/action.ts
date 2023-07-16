import { GraphQLClient } from "graphql-request";
import { createUserMutation, getUserQuery } from "@/graphql";

const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';

const client = new GraphQLClient( apiUrl ); //1

const makeGraphQLRequest = async( query: string, variables ={} ) => { //2

    try {
        return await client.request( query, variables )
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getUser = (email: string) => { //3
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getUserQuery, { email })
}

export const createUser = (name:string, email:string, avatarUrl:string) => {
    client.setHeader("x-api-key", apiKey);
    const variables = {
        input: {
            name: name,
            email: email,
            avatarUrl: avatarUrl
        },
    };
    return makeGraphQLRequest(createUserMutation, variables);
}