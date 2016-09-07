import React from 'react';
import styles from '../styles/reportHeader';

class ReportHeader extends React.Component {

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }

  update() {
    this.props.onToggleDisplay(!this.props.showing);
  }

  render() {
    styles.testLink.color = this.props.passed ? '#3c763d' : '#a94442';
    const totalTests = this.props.test.mgReporterObj.results.stats.tests;
    const badge = this.props.passed ?
      <div style={styles.badge}>
        <p style={styles.success}>Success, { totalTests} Total Tests</p>
      </div>
      :
      <div style={styles.badge}>
        <p style={styles.failed}>{this.props.test.mgReporterObj.results.stats.failures} Failed, {totalTests} Total Tests</p>
      </div>

    const showTagDisplay = this.props.showing ? "hide tags" : "show tags";

    return (
      <div style={styles.headerStyle} className='report-header'>
        <div style={styles.testName}>
          <a target='_blank' style={styles.testLink} href={this.props.test.link}>
            {this.props.test.jobName}
          </a>
        </div>
        <div style={styles.date}>
           <p>{this.props.test.timestamp}</p>
        </div>
        <div style={styles.toggleTags}>
          <a style={styles.toggle} onClick={this.update}>[{showTagDisplay}]</a>
        </div>
        {badge}
      </div>
    )
  }
}

export default ReportHeader;
