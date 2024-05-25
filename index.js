// Packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');

// Array of objects to prompt for user input
const messages = [
    { type: 'input', name: 'Title', message: 'What is the title? ' },
    { type: 'input', name: 'Description', message: 'Provide a short description explaining the what, why, and how of your project ' },
    { type: 'input', name: 'Installation', message: 'What are the steps required to install your project? ' },
    { type: 'input', name: 'Usage', message: 'Provide instructions and examples for use ' },
    { type: 'input', name: 'screenshot', message: 'Add an image/screenshot ' },
    { type: 'input', name: 'Credits', message: 'List your collaborators, if any, with links to their GitHub profiles. ' },
    { type: 'list', name: 'License', choices: ["Apache License 2.0", "GNU-GPLv3", "MIT", "ISC", "No license"] },
    { type: 'input', name: 'Badges', message: 'Add badges if needed ' },
    { type: 'input', name: 'Features', message: 'If your project has a lot of features, list them here. ' },
    { type: 'input', name: 'Contribute', message: 'If you would like other developers to contribute, you can include guidelines for how to do so. ' },
    { type: 'input', name: 'Tests', message: 'If you wrote tests for the project you can provide examples on how to run them here. ' },
    { type: 'input', name: 'username', message: 'What is your Github username? ' },
    { type: 'input', name: 'email', message: 'What is your contact email address? ' },
];

// Object to hold the license detaisl so that a badge can be generated to include a link to the website.
const LicensesObj = {
    "Apache License 2.0": "[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)",
    "GNU GPLv3": "[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)",
    MIT: "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)",
    ISC: "[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)",
}

// Function to write README file
function writeToFile(data) {

    // Create an object with data relevant to the index only 
    const indexObj = {
        ...data,
        Title: null,
        Description: null,
        Index: null,
        screenshot: null,
        username: null,
        email: null
    }

    // Add screenshot data to a variable. data.screenshot set to null so that it does not follow the default case in the switch statement.
    const screenshotVar = data.screenshot;
    data.screenshot = null;

    // Loop through keys in the data object container the secions and answers provided by the user.
    for (item in data) {
        // Utilised a loop over a static block of text so that empty sections could be skipped when writing to file.
        if (data[item]) {
            switch (item) {
                case "Title":
                    // Will create a new file and trigger specific warning if error in writeFile func
                    // Title, license button, and description written in below function.
                    let writeTitle = async () => {
                        fs.writeFile('README.md', `# ${data.Title ? data.Title : "README"}\n${data.License != "No license" ? LicensesObj[data.License] : ""} \n\n ${data.Description ? `## Description\n ${data.Description}\n` : "null"}`, (err) => {
                            if (err) { console.error('Failed to create file') }
                        });
                    }
                    // Loop through indexObj, which only includes categories relevant to index
                    let writeIndex = async () => {
                        for (i in indexObj) {
                            if (indexObj[i]) {
                                fs.appendFile('README.md', `\n- [${i}](#${i.toLowerCase()})\n`, (err) =>
                                    err ? console.error(err) : null
                                );
                            }
                        }
                    }
                    writeTitle();
                    writeIndex();
                    // Update Description to Null to avoid duplication
                    data.Description = null;
                    break

                // Ensures screenshot tot he usage section, user will add the file location only
                case "Usage":
                    let writeUsage = async () => {
                        await fs.appendFile('README.md', `## ${item}\n${data[item]}\n\n${screenshotVar ? `![image](${screenshotVar})` : ""} \n`, (err) =>
                            err ? console.error("Failed to add usage/screenshot") : null
                        );
                    }
                    writeUsage();
                    break
                // Prints license section only if a license was chosen. If the user selects 'No license' the license section is not added to the file.
                case "License":
                    let writeLicense = async () => {
                        if (data.License != "No license") {
                            await fs.appendFile('README.md', `## ${item} \n This software is licensed under the ${data.License} license.\n\n`, (err) =>
                                err ? console.error("Failed to add License") : null
                            )
                        };
                    }
                    writeLicense();
                    break
                // Questions section is added to the file if either one, or both username and email are provided.
                // Message updates to reflect relevant choice.
                case "username":
                case "email":
                    let writeContact = async () => {
                        if (data.email) {
                            if (data.username) {
                                await fs.appendFile('README.md', `## Questions\n For any questions relating to this software, I can be contacted on github at https://github.com/${data.username} or via email at ${data.email}\n\n`, (err) =>
                                    err ? console.error(err) : null
                                );
                            } else {
                                await fs.appendFile('README.md', `## Questions\n For any questions relating to this software, I can be contacted on github at https://github.com/${data.username}\n\n`,
                                    (err) => err ? console.error(err) : null
                                );
                            }
                        } else if (data.username) {
                            await fs.appendFile('README.md', `## Questions\n For any questions relating to this software, I can be contacted via email at ${data.email}\n\n`, (err) =>
                                err ? console.error(err) : null
                            );
                        }
                    }
                    // Updates both variables to null to ensure that this case is only run once.
                    data.username = null
                    data.email = null
                    writeContact();
                    break

                default:
                    // Writes additional sections to file
                    let writeDef = async () => {
                        await fs.appendFile('README.md', `## ${item}\n${data[item]}\n\n`, (err) =>
                            err ? console.error(err) : null
                        );
                    }
                    writeDef();
            }

        }
    }
}

// Function to initialize app
function init() {

    // Inquirer takes in array of objects containing questions for the user to answer
    inquirer
        .prompt(messages)
        // Once user has finished providing answers, the writeTo FIle funciton is called with the users answers passed as a parameter
        .then((answers) => {
            writeToFile(answers)

        })
        // Notify the user if there is an error.
        .catch((error) => {
            // Specific error message if the program is not run in an interactive environment. 
            if (error.isTtyError) {
                console.error("Prompt couldn't be rendered in the current environment")
            } else {
                // For other error types, details of the error are logged to console.
                console.log(error);
            }
        });
}
// Function call to initialize app
init();
