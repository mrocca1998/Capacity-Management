import * as React from "react";
import { render } from "react-dom";
import { Chart } from "react-google-charts";
 
class CapChart extends React.Component {
  render() {
    return (
      <div className={"my-pretty-chart-container"}>
        <Chart
  width={'100%'}
  height={'400px'}
  chartType="Gantt"
  loader={<div>Loading Chart</div>}
  data={this.props.data}
  options={{
    height: 400,
    gantt: {
      trackHeight: 30,
    },
  }}
  rootProps={{ 'data-testid': '2' }}
/>
      </div>
    );
  }
}
export default CapChart;