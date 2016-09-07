'use strict';

const express = require('express');
const fs = require('fs');
const glob = require('glob');
const moment = require('moment');

module.exports = function (app, conf) {

  const fileSearchPath = conf.pathToWorkspace + conf.folderSubstr + conf.pathToReport;
  const jsonSearchStr = fileSearchPath + conf.jsonFileName;
  const __S = '/';

  let runs = {
    qa: [],
    stage: []
  };

  function getMGRuns(environment) {
    const files = glob.sync(jsonSearchStr);
    runs = {
      qa: [],
      stage: []
    };
    files.forEach(function (path) {
      const json = JSON.parse(fs.readFileSync(path, {encoding : 'utf8'}));
      const dayDiff = getDayDifference(json.timestamp);
      if (json.results.env === environment && dayDiff < 14) {
        const reportObj = getLinkInfo(path);
        const lowerName = reportObj.jobName.toLowerCase();
        if (lowerName.indexOf('sauce') >= 0 || lowerName.indexOf('cleanup') >= 0) {
          return;
        }
        const obj = {
            link : reportObj.link,
            jobName : reportObj.jobName.replace('MechaGodzilla', ''),
            mgReporterObj : json,
            env: json.results.env,
            timestamp: formatDate(json.timestamp)
        };
        if (runs.hasOwnProperty(json.results.env)) {
          runs[json.results.env].push(obj);
        } else {
          runs[json.results.env] = [obj];
        }
      }
    });
    const foundTests = runs.hasOwnProperty(environment) ? runs[environment] : [];
    if (foundTests.length > 0) {
      foundTests.sort(function (t1, t2) {
        return (t1.jobName <= t2.jobName) ? -1 : 1;
      });
    }
    return { tests: foundTests };
  }

  function getDayDifference(timestamp) {
    const testDateArray = timestamp.split(', ')[1].split(' ');
    testDateArray[1] = testDateArray[1].replace(/[a-z]/gi, '');
    const runDate = new Date(testDateArray.join(' '));
    const today = new Date();
    return Math.floor((today - runDate) / 86400000);
  }

  function formatDate(timestamp) {
    const testDateArray = timestamp.split(', ')[1].split(' ');
    testDateArray[1] = testDateArray[1].replace(/[a-z]/gi, '');
    const runDate = new Date(testDateArray.join(' '));
    return moment(runDate).format('ddd, MMM Do');
  }

  function getLinkInfo(jsonPath) {
    const url = conf.baseReportUrl; // base URL on Jenkins
    const filePath = jsonPath.split(conf.omitFromWebUrl)[1]; // omit part of file path that is not in web URL
    const pathArr = filePath.split(__S); // split remaining path into array
    let jobDirName;
    pathArr.pop(); // remove the json file name from the end of the path

    // if the path began with "/" then the fist segment will be empty string. discard it.
    if (pathArr[0] === '') {
        pathArr.shift();
    }

    jobDirName = pathArr.length ? pathArr.shift() : ''; // get the job name (the folder name at the beginning of the path)
    return {
        link : url + jobDirName + __S + conf.urlFolderName + __S + pathArr.join(__S) + __S + conf.reportFileName,
        jobName : jobDirName || 'Unknown MG Job'
    };
  };

  app.get('/tests/:env/:team?', function (req, res) {
    /* TODO:
    * At some point, send the team path as well to only return
    * tests for a certain team. Right now it only works on the
    * environment.
    */
    res.send(getMGRuns(req.params.env));
  });

  app.get('/:env*?', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
  });

}
