const axios = require('axios');
const { response } = require('express');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLInputObjectType,
} = require('graphql');

const apiURL = 'https://jsonplaceholder.typicode.com/';

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        website: { type: GraphQLString }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        userId: { type: GraphQLInt },
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        body: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve(parentValue, args) {
                return axios.get(`${apiURL}users/${args.id}`)
                    .then(response => response.data)
            }
        },
        post: {
            type: PostType,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve(parentValue, args) {
                return axios.get(`${apiURL}posts/${args.id}`)
                    .then(response => response.data)
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery
});