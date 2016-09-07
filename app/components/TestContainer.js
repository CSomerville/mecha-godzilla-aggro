import React from 'react';
import ReportHeader from './ReportHeader';
import ReportContainer from './ReportContainer';
import uniq from 'lodash.uniq';
import styles from '../styles/testContainer';

class TestContainer extends React.Component {

  constructor(props) {
    super(props);
    this.onToggleDisplay = this.onToggleDisplay.bind(this);
    this.state = {
      showTags: false
    }
  }

  onToggleDisplay() {
    this.setState({ showTags: !this.state.showTags });
  }
  render() {
    const testObj = this.props.test;
    const reportObj = testObj.mgReporterObj.results;
    const passed = reportObj.stats.failures === 0;

    const titles = uniq(Object.keys(reportObj.tests).join(' ').match(/@[a-z0-9\-]*\s/gi));
    const container = this.state.showTags ? <ReportContainer titles={titles}></ReportContainer> : null;
    return (
      <div style={styles.containerStyle} className='test-container'>
        <ReportHeader test={testObj} showing={this.state.showTags} onToggleDisplay={this.onToggleDisplay} passed={passed}></ReportHeader>
        {container}
      </div>
    );
  }
}

export default TestContainer;
