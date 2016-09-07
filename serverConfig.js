'use strict';
// Live (server) config :
module.exports = {
   fullConfigPath : '/dibs/settings/aggregateReport.js', // path to the production config for the aggro-app
   baseReportUrl :  'http://jenkins.1stdibs.com/view/MechaGodzilla/job/', // base URL for the report (jenkins)
   omitFromWebUrl : '/jenkins/workspace', // path on selenium server that is not public via url
   reportFileName : 'testReport.html', // name of the report file name (used to create link)
   pathToWorkspace : '/jenkins/workspace/', // file path to MG workspaces
   urlFolderName : 'ws', // folder name that gets inserted into the url between the job (dir) name and path to file.
   folderSubstr : 'Mecha*', // Substring used to search for projects that match MG inside workspace dir
   pathToReport : '/lib/reporter/', // path inside of MG workspace to the report directory
   jsonFileName : 'testOutput.json', // name of the json file inside the MG workspace report dir
   port : 80 // port to run the mecha-aggro app on.
};

// This *should work if you want to try it out locally :
// module.exports = {
//     fullConfigPath : '/dibs/settings/aggregateReport.js', // path to the production config for the aggro-app
//     baseReportUrl :  '', // base URL for the report (jenkins)
//     omitFromWebUrl : 'mecha-godzilla-aggro/', // path on selenium server that is not public via url
//     reportFileName : 'testReport.html', // name of the report file name (used to create link)
//     pathToWorkspace : '/Users/*/projects/', // file path to MG workspaces
//     urlFolderName : 'mecha-godzilla-aggro', // folder name that gets inserted into the url between the job (dir) name and path to file.
//     folderSubstr : 'mecha-godzilla-aggro/*/', // Substring used to search for projects that match MG inside workspace dir
//     pathToReport : '/lib/reporter/', // path inside of MG workspace to the report directory
//     jsonFileName : 'testOutput.json', // name of the json file inside the MG workspace report dir
//     port : 9876 // port to run the mecha-aggro app on.
// };
