import React from 'react';
import TestContainer from './TestContainer';
import uniq from 'lodash.uniq';
import request from 'request';
import teamJobs from '../teamJobs';
import styles from '../styles/testsWrapper';

class TestsWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.retrieveTests = this.retrieveTests.bind(this);
    this.filterTests = this.filterTests.bind(this);
    this.state = {
      loading: true,
      currTests: []
    }
  }
  componentWillMount() {
      this.retrieveTests(`http://mg.intranet.1stdibs.com:/tests/${this.props.env}/${this.props.team}`);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.env !== this.props.env) {
      //NOTE: This means that a new env was selected, and tests should be fetched
      this.setState({ currTests: [], loading: true });
      this.retrieveTests(`http://mg.intranet.1stdibs.com/tests/${newProps.env}/${newProps.team}`);
    }
  }

  retrieveTests(requestURL) {
    request(requestURL, (err, response, body) => {
      const receivedTests = JSON.parse(body);
      this.setState({ currTests: receivedTests.tests, loading: false });
    });
  }

  filterTests() {
    let testsHtml;
    if (this.state.loading) {
      testsHtml = <p style={styles.message}><img src='../images/mg_spinner.png' className='loader'></img></p>
    } else if (this.state.currTests.length > 0) {
      testsHtml = this.state.currTests.map((test) => {
        let results = test.mgReporterObj.results;
        let row = <TestContainer key={test.jobName} test={test}></TestContainer>

        const tagNames = uniq(Object.keys(results.tests).join(' ').match(/@[a-z0-9\-]*\s/gi)).join(' ');
        //If there is a search term and that search term is NOT contained in the string
        // of test names, do not return the result.
        if (this.props.searchTerm !== '' && tagNames.indexOf(this.props.searchTerm) < 0) {
          return null;
        }

        //If the "Show Only Failing" is checked, and there were no failed results
        // do not return this test
        if (this.props.onlyFailing && results.stats.failures === 0) {
          return null;
        }

        // If the current team is all, always return the jobs
        // Else, see if the job is contained in the array for the current team
        // If it is not, result will be -1, and shouldReturn will be set to false
        if (this.props.team !== 'all' && teamJobs[this.props.team].indexOf(test.jobName) < 0) {
          return null;
        }

        return row;
      });
      const testsArray = uniq(testsHtml);

      //If the result of filtering above returned no results,
      // display a proper error message
      if (testsArray[0] === null && testsArray.length === 1) {
        if (this.props.onlyFailing) {
          testsHtml = <h1 style={styles.message}>No Failing Results For Your Search</h1>
        } else {
          testsHtml = <h1 style={styles.message}>No Results Found For Search</h1>
        }
      }
    } else {
      testsHtml = <h1 style={styles.message}>No Tests For Environment: {this.props.env}</h1>;
    }

    return testsHtml;
  }

  render() {
    const testsHtml = this.filterTests();
    return (
      <div id='tests-div'>
        {testsHtml}
      </div>
    );
  }
}

export default TestsWrapper;
