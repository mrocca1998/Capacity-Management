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
        <CapChart height = {this.props.height} data = {[this.props.chartSettings, 
          [1,
          this.props.title + ' BA',
          null,
          new Date(this.props.startDate),
          new Date(this.props.baEndDate),
          null,
          (this.props.totalPoints - this.props.baPoints)/this.props.totalPoints * 100,
          null,], 
          [2,
          this.props.title + ' QA',
          this.props.endDate && new Date(this.props.qaEndDate) > new Date(this.props.endDate) ? 'Insufficient Resources' : null,
          new Date(this.props.startDate),
          new Date(this.props.qaEndDate),
          null,
          (this.props.totalPoints - this.props.qaPoints)/this.props.totalPoints * 100,
          null,], 
          [3,
          this.props.title + ' Dev',
          this.props.endDate && new Date(this.props.devEndDate) > new Date(this.props.endDate) ? 'Insufficient Resources' : null,
          new Date(this.props.startDate),
          new Date(this.props.devEndDate),
          null,
          (this.props.totalPoints - this.props.devPoints)/this.props.totalPoints * 100,
          null,],]} />
        </div>
      )
    }
  }
  
  export default BreakdownChart;