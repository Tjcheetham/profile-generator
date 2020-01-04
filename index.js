const fs = require("fs");
const inquirer = require("inquirer");
const generateHTML = require("./generateHTML");
const axios = require("axios");
require("dotenv").config();


var question = [
    {
        type: "input",
        name: "username",
        message: "What is your GitHub username?"
    },
    {
        type: "list",
        name: "color",
        message: "What's your favorite color?",
        choices: [
            "red",
            "blue",
            "green",
            "pink"
        ]
    },
    
]


inquirer 
.prompt(question)
    .then(answers => {
        const username = answers.username
        const color = answers.color

        axios.get(
            `https://api.github.com/users/${username}?client_id=${
            process.env.CLIENT_ID
            }&client_secret=${process.env.CLIENT_SECRET}`
        )
        .then(function (res) {
            console.log(res.data);
            axios
                .get(
                    `https://api.github.com/users/${username}/repos?client_id=${
                    process.env.CLIENT_ID
                    }&client_secret=${process.env.CLIENT_SECRET}&per_page=100`
                )
                .then(function (stars) {
                    let starTotal = 0;
                    stars.data.forEach(repo => {
                        starTotal += repo.stargazers_count;
                    });

                    const userData = {
                        image: res.data.avatar_url,
                        name: res.data.name,
                        location: res.data.location,
                        githubUrl: res.data.url,
                        blog: res.data.blog,
                        bio: res.data.bio,
                        pubicRepos: res.data.public_repos,
                        followers: res.data.followers,
                        following: res.data.following,
                        stars: starTotal,
                        color: color

                    }

                    return generateHTML(userData);
                }).then(function (html) {

                    fs.writeFile("resume.html", html, function(err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("all good!");
                    })
                });
        
        });
      
    });
