const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema.js');
const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})