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
    const { stats } = this.props.test.mgReporterObj.results;
    const total = stats.failures + stats.passes + stats.pending;
    const pending = stats.pending;
    let failures;
    let successes;
    if (stats.rerunStats) {
      failures = stats.rerunStats.failures;
      successes = stats.passes + stats.rerunStats.passes;
    } else {
      failures = stats.failures;
      successes = stats.passes;
    }
    styles.testLink.color = failures === 0 ? '#3c763d' : '#a94442';
    const successCopy = `${successes} Success${(successes === 1) ? '' : 'es'}, `;
    const failureCopy = `${failures} Failure${(failures === 1) ? '' : 's'}, `;
    const badge = failures === 0 ?
      <div style={styles.badge}>
        <p style={styles.success}>{successCopy}{pending > 0 && `${pending} Pending, `}{total} Total Tests</p>
      </div>
      :
      <div style={styles.badge}>
        <p style={styles.failed}>{successCopy}{failureCopy}{pending > 0 && `${pending} Pending, `}{total} Total Tests</p>
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
