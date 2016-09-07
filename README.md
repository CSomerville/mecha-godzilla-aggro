#MechaGodzilla Aggro Reporter Server

The complete server to deploy the aggregate reporter for MechaGodzilla tests. The
reporter displays the results of tests based on what server is being requested.
All reports older than 14 days are ignored, showing only the most recent results.
The returned results show successes/failures and links to the Jenkins reports.

[NOTE]: To expand filtering by teams, see the filterTests functions in TestsWrapper.js
It works by checking whether a test name is in the array for a team if the team
is not set to all. Right now only works for qa finding and only for a few tests.
Expand the object in teamJobs.js to include more of the names. The names to add are
the names of the Jenkins jobs, for example: "MechaGodzilla Buyer Account Tests - Base (QA)"

##Server Configuration - Development

The server can run in two states, one for development and one for deployment.
When making changes or adding features, ensure that the serverConfig.js file has
the bottom configuration uncommented, so that it will find your local files. To
give multiple results, retrieve workspace files from the Jenkins reports and store
them in `/Users/{your_name}/projects/mecha-godzilla-aggro/{name_of_test}`. This
will allow the default development configuration to find your tests and load the
appropriate information. When starting the server for development, run these two
commands in separate terminals from the base directory:
```
 gulp
 npm run watch
```
These two commands will watch for changes for both the front end code and the server
code which will help with development.

##Server Configuration - Deployment
When committing files for deployment make sure to uncomment the top items in
the serverConfig.js files. These are the settings needed for the server to run
successfully and collect the test runs on Jenkins. The Jenkins job for the aggregate
reporter will notice changes pushed/committed and deploy the server by running:
```
npm run deploy
```
This command cleans and installs the npm modules, browserify the
front end code, touch the files used for output from the server, and start the
server in a background process.

##Servers and Teams
To update/add/remove a server or team, the files are located in the app/ folder,
in the servers.js and teams.js files, respectively. Simply add an item to the array,
and on the next refresh the page should will add these to the list of available
servers/teams.
