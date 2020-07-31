import * as React from "react";
import { render } from "react-dom";
import { Chart } from "react-google-charts";
 
class CapChart extends React.Component {
  chartStyle = {
    marginLeft : 50,
    marginRight : 50,
  }
  render() {
    return (
      <div style = {this.chartStyle}
      className={"my-pretty-chart-container"}>
        <Chart
  width={'100%'}
  height={this.props.height +'px'}
  chartType="Gantt"
  loader={<div>Loading Chart</div>}
  data={this.props.data}
  options={{
    height: this.props.height,
    gantt: {
      trackHeight: 30,
      criticalPathEnabled: false,
      sortTasks: false,
      innerGridTrack: 'purple',
    },
  }}
  rootProps={{ 'data-testid': '2' }}
/>
      </div>
    );
  }
}

export default CapChart;

