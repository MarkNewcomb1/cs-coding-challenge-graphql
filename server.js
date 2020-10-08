const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema.js');
const app = express();
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();
const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;

async function getAccessToken(code) {
    const res = await fetch('https://github.com/login/oauth/access_token', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id,
            client_secret,
            code
        })
    });
    const data = await res.text();
    const params = new URLSearchParams(data);
    return params.get('access_token');
}

async function getGithubUser(access_token) {
    const req = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `bearer ${access_token}`
        }
    });
    const data = await req.json();
    return data;
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.get('/login/github', (req, res) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=http://localhost:4000/login/github/callback`;
    res.redirect(url);
});

app.get('/login/github/callback', async (req, res) => {
    const code = req.query.code;
    const token = await getAccessToken(code);
    const githubData = await getGithubUser(token);
    res.json(githubData);
});

// For Heroku
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});