import React from 'react';
import CapChart from './CapChart';
class BreakdownChart extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
      super(props)
    }
  
    render() {   
      return (   
        <div>    
            <h3 style={{textAlign: "center"}}>{this.props.title} Breakdown</h3> 
        <CapChart data = {[this.props.chartSettings, 
          [1,
          this.props.title + ' BA',
          null,
          new Date(this.props.startDate),
          new Date(this.props.baEndDate),
          null,
          null,
          null,], 
          [2,
          this.props.title + ' QA',
          null,
          new Date(this.props.startDate),
          new Date(this.props.qaEndDate),
          null,
          null,
          null,], 
          [3,
          this.props.title + ' Dev',
          null,
          new Date(this.props.startDate),
          new Date(this.props.devEndDate),
          null,
          null,
          null,],]} />
        </div>
      )
    }
  }
  
  export default BreakdownChart;