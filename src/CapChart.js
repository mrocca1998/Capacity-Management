import * as React from "react";
import { Chart } from "react-google-charts";
 
class CapChart extends React.Component {
  chartStyle = {
    marginLeft : 50,
    marginRight : 50,
  }
  daysBetween(firstDate, secondDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
  }
  render() {
    return (
      <div style = {this.chartStyle}
      className={"my-pretty-chart-container"}>
        <Chart
  width={'100%'}
  //height={this.props.height +'px'}
  height = {this.props.height}
  chartType="Gantt"
  loader={<div>Loading Chart</div>}
  data={this.props.data}
  options={{
    height: this.props.height,
    //height: this.props.height,
    gantt: {
      labelStyle: {
        color: 'white',
        fontName: 'Arial',
        fontSize: 15,
        
      },
        
      palette: [
        {
          "color": "#FF3333",
          "dark": "#5377ed",
          "light": "#9400D3"
        }
      ],
      trackHeight: 30,
      criticalPathEnabled: false,
      sortTasks: false,
      tooltip : {
        trigger: 'none'
      }
    },
  }}
  rootProps={{ 'data-testid': '2' }}
/>
      </div>
    );
  }
}

export default CapChart;

