import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import CapChart from './CapChart';
import BreakdownChart from './BreakdownChart';
import * as serviceWorker from './serviceWorker';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ProjectForm, Project } from './ProjectsForm';
import { API_ROOT } from './api-config';
import EmployeeCollapsable from './EmployeeCollapse';



//chart library format
// const chartSettings = [
//     [
//       { type: 'string', label: 'Task ID' },
//       { type: 'string', label: 'Task Name' },
//       { type: 'string', label: 'Resource' },
//       { type: 'date', label: 'Start Date' },
//       { type: 'date', label: 'End Date' },
//       { type: 'number', label: 'Duration' },
//       { type: 'number', label: 'Percent Complete' },
//       { type: 'string', label: 'Dependencies' },
//     ], 
//     [
//       'EEL',
//       'EEL',
//       null,
//       new Date(2020, 5, 1),
//       new Date(2020, 7, 14),
//       null,
//       100,
//       null,
//     ],
//   ];


function Legend(props) {
  return <table rules ='all' 
  class = "legendTable">
 <tr class = "legendTable">
    <th style = {{width: 20}}>Weight</th>
    <th style = {{width: 50}}>Description</th>
    <th width = '50'> BA Hours per point</th>
    <th width = '50'> QA Hours per point</th>
    <th width = '50'> Dev Hours per point</th>
  </tr>
<tr class = "legendTable">
    <td>1</td>
    <td>Full capactiy</td>
    <td>6</td>
    <td>11</td>
    <td>9</td>
  </tr>
<tr class = "legendTable">
    <td>.75</td>
    <td>Progressing towards full capacity or also mentoring junior members</td>
    <td>13</td>
    <td>19</td>
    <td>17</td>
  </tr>
<tr class = "legendTable">
    <td>.50</td>
    <td>New Employee</td>
    <td>28</td>
    <td>38</td>
    <td>33</td>
  </tr>
  <tr class = "legendTable">
    <td>.25</td>
    <td>Lead, not much direct work</td>
    <td>63</td>
    <td>63</td>
    <td>63</td>
  </tr>
</table>;
}



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [
        [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'string', label: 'Resource' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
      ],
      ], projects: [], allocations: [], employees: [], height: 0, 
      monthNames : ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ],
      showLegend: false, 
      employeeRows : [],
      projectRows:{},
    };
    this.refreshState = this.refreshState.bind(this);
    this.toggleLegend = this.toggleLegend.bind(this);
    this.expandEmRow = this.expandEmRow.bind(this);
    this.collapseEmRow = this.collapseEmRow.bind(this);
    this.expandProjectRow = this.expandProjectRow.bind(this);
    this.collapseProjectRow = this.collapseProjectRow.bind(this);
  }
  async refreshState () {
      await fetch(API_ROOT + 'projects')
      .then(res => res.json())
      .then(json => {
          const projectData = [this.state.chartData[0],];
          const rowCopy = {};
          json.map(project =>

              projectData.push([
                  project.id,
                  project.endDate? 
                  project.title + '\nIntended ' + project.endDate.substring(5,10) + '-' + project.endDate.substring(0,4) + '\nCalculated ' + project.calcEndDate.substring(5,10) + '-' + project.calcEndDate.substring(0,4)
                  : 
                  project.title + '\nCalculated ' + project.calcEndDate.substring(5,10) + '-' + project.calcEndDate.substring(0,4),
                  null,
                  new Date(project.startDate),
                  new Date(project.calcEndDate),
                  null,
                  project.endDate && new Date(project.calcEndDate) >= new Date(project.endDate)? Math.round(100 * this.daysBetween(new Date(project.startDate), new Date(project.endDate))/ this.daysBetween(new Date(project.startDate), new Date(project.calcEndDate))) : 100,
                  null,
              ]),
          )

          json.map(project =>
            rowCopy[project.title] = [],
          )       

          
          this.setState({
            projects: json,
            chartData: projectData,
            projectRows: rowCopy,
            height: (120 + (json.length * 100)),
          });
        }
        
      )
      this.setState({
        empty: this.state.projects.length === 1
      });
      await fetch(API_ROOT + 'employees')
      .then(res => res.json())
      .then(json => {
          this.setState({
              employees: json
          });
        },
      )
      await fetch(API_ROOT + 'allocations')
      .then(res => res.json())
      .then(json => {
          this.setState({
              allocations: json,
              });
        },
      )   
  }

  toggleLegend() {
    this.setState({
      showLegend: !this.state.showLegend,
    })
  }

  expandEmRow = (rowId) => {
    this.setState(prevState => ({
    	employeeRows: [...prevState.employeeRows, rowId],
    }));
  }

  collapseEmRow(rowId) {
    this.setState({
      employeeRows: this.state.employeeRows.filter(id => id !== rowId)
    })
  }

  expandProjectRow = (rowId, projectName) => {
    const rowsCopy = this.state.projectRows;
    rowsCopy[projectName].push(rowId);
    this.setState ({
      projectRows: rowsCopy
    })
  }


  collapseProjectRow(rowId, projectName) {
    const rowsCopy = this.state.projectRows;
    rowsCopy[projectName] = rowsCopy[projectName].filter(id => id !== rowId);
    this.setState ({
      projectRows: rowsCopy
    })
  }

  daysBetween(firstDate, secondDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
  }
  
  componentDidMount() {
    this.refreshState();
  };  

	render() {
    const buttonStyle = {
      borderRadius : '10px',
      borderWidth: '1px',
      textAlign: 'center'
    }
    const tabStyle = {
      borderColor: 'blue',
      marginLeft : '10%',
      marginRight : '10%',
    }
  	return (
    	<div class = "body">
      <div class = "header"><h1><b>{this.props.title}</b></h1></div>
      <br/>
        {this.state.projects.length === 0 ? <div/> : 
          <div class = "sticky" style = {{height: 45 + 60 * this.state.projects.length}}>
            <CapChart
              data={this.state.chartData} 
              height = {45 + 60 * this.state.projects.length} 
              trackHeight = {60}
              refreshState = {this.refreshState}/>
          </div >}
        <div class = "theRest">
        <br/>
        <div class = "cenButton"><button style = {buttonStyle} onClick = {this.toggleLegend}>{this.state.showLegend ? 'Hide' : 'Show'} Legend</button></div>
        <br/>
        {this.state.showLegend ? <span><Legend /><br/></span> : <span/>}
        
        
        <Tabs style = {tabStyle}>
            <TabList>
              <Tab >Employees</Tab>
              {this.state.projects.map(project => <Tab key = {project.id}>{project.title}</Tab>)}
              <Tab >+</Tab>
            </TabList>
            <TabPanel>
              <EmployeeCollapsable 
                employees = {this.state.employees}
                allocations = {this.state.allocations}
                projects = {this.state.projects}
                refreshState = {this.refreshState}
                expandEmRow = {this.expandEmRow}
                collapseEmRow = {this.collapseEmRow}
                employeeRows = {this.state.employeeRows}
              />
            </TabPanel>
            {this.state.projects.map(project => <TabPanel key = {project.id}>
              
              <div>
              <Project 
              monthNames = {this.state.monthNames}
              refreshState = {this.refreshState} 
              employees = {this.state.employees} 
              allocationState = {this.state.allocations}  
              expandProjectRow = {this.expandProjectRow}
              collapseProjectRow = {this.collapseProjectRow}
              projectRows = {this.state.projectRows}
              {...project}/>
              <BreakdownChart height = {150} chartSettings = {[
              { type: 'string', label: 'Task ID' },
              { type: 'string', label: 'Task Name' },
              { type: 'string', label: 'Resource' },
              { type: 'date', label: 'Start Date' },
              { type: 'date', label: 'End Date' },
              { type: 'number', label: 'Duration' },
              { type: 'number', label: 'Percent Complete' },
              { type: 'string', label: 'Dependencies' },
              ]} 
              {...project}/>
              </div>
            </TabPanel>)}
            <TabPanel>
              <ProjectForm 
              
                height = {this.state.height}
                isEditing = {false}
                allocations = {this.state.allocations} 
                employees = {this.state.employees} 
                projects = {this.state.projects} 
                refreshState={this.refreshState}
              />
            </TabPanel>
          </Tabs  >

      </div>
      </div>
      

      
    );
  }	
}
ReactDOM.render(
  <App title = {'Webteams Capacity Management'}/>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
