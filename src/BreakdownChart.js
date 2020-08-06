import React from 'react';
import CapChart from './CapChart';
class BreakdownChart extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
      super(props)
    }
  
    render() {   
      this.monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ]
      return (   
        <div>    
            <h3 style={{textAlign: "center"}}>{this.props.title} Breakdown</h3> 
        <CapChart height = {this.props.height} data = {[this.props.chartSettings, 
          [1,
          'BA: ' + this.monthNames[new Date(this.props.baEndDate).getMonth()] + ' ' + this.props.baEndDate.substring(8, 10)+ ', ' + this.props.baEndDate.substring(0, 4),
          null,
          new Date(this.props.startDate),
          new Date(this.props.baEndDate),
          null,
          (this.props.totalPoints - this.props.baPoints)/this.props.totalPoints * 100,
          null,], 
          [2,
          'QA: ' + this.monthNames[new Date(this.props.qaEndDate).getMonth()] + ' ' + this.props.qaEndDate.substring(8, 10)+ ', ' + this.props.qaEndDate.substring(0, 4),
          this.props.endDate && new Date(this.props.qaEndDate) > new Date(this.props.endDate) ? 'Insufficient Resources' : null,
          new Date(this.props.startDate),
          new Date(this.props.qaEndDate),
          null,
          (this.props.totalPoints - this.props.qaPoints)/this.props.totalPoints * 100,
          null,], 
          [3,
          'Dev: ' + this.monthNames[new Date(this.props.devEndDate).getMonth()] + ' ' + this.props.devEndDate.substring(8, 10)+ ', ' + this.props.devEndDate.substring(0, 4),
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