// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');

// TODO: Create an array of questions for user input
const questions = [
    'Project Title',
    'Description',
    'Installation',
    'Usage',
    'Credits',
    'License',
    'Badges',
    'Features',
    'How to Contribute',
    'Tests'
];

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, (err) => {
        err ? console.error(err) : console.log('README created!')
    })
 }

// TODO: Create a function to initialize app
function init() { }

// Function call to initialize app
init();
