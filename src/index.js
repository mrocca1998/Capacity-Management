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

// padding: 10px;
//         border: 2px solid #1c87c9;
//         border-radius: 5px;
//         background-color: #e5e5e5;
//         text-align: center;

function Legend(props) {
  const tableStyle = {
    border: '2px solid black',
    backgroundColor: '#d3e4ee',
    marginLeft : 'auto',
    marginRight : 'auto',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  }
  return <table rules ='all' 
  style = {tableStyle}>
<thead>
 <tr>
    <th style = {{width: 20}}>Weight</th>
    <th style = {{width: 50}}>Description</th>
    <th width = '50'> BA Hours per point</th>
    <th width = '50'> QA Hours per point</th>
    <th width = '50'> Dev Hours per point</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>.25</td>
    <td>Lead, not much direct work</td>
    <td>63</td>
    <td>63</td>
    <td>63</td>
  </tr>
  <tr>
    <td>.50</td>
    <td>New Employee</td>
    <td>28</td>
    <td>38</td>
    <td>33</td>
  </tr>
  <tr>
    <td>.75</td>
    <td>Progressing towards full capacity or also mentoring junior members</td>
    <td>13</td>
    <td>19</td>
    <td>17</td>
  </tr>
  <tr>
    <td>1</td>
    <td>Full capactiy</td>
    <td>6</td>
    <td>11</td>
    <td>9</td>
  </tr>
</tbody>
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
    };
    this.refreshState = this.refreshState.bind(this);
    this.toggleLegend = this.toggleLegend.bind(this);
  }
  async refreshState () {
      await fetch(API_ROOT + 'projects')
      .then(res => res.json())
      .then(json => {
          const projectData = [this.state.chartData[0],];

          json.map(project =>
              projectData.push([
                  project.id,
                  project.title + ': ' + this.state.monthNames[new Date(project.calcEndDate).getMonth()] + ' ' + project.calcEndDate.substring(8, 10)+ ', ' + project.calcEndDate.substring(0, 4),
                  project.endDate && new Date(project.calcEndDate) > new Date(project.endDate) ? 'Insufficient Resources' : null,
                  new Date(project.startDate),
                  new Date(project.calcEndDate),
                  null,
                  100 * (((project.totalPoints-project.baPoints)+(project.totalPoints-project.qaPoints)+(project.totalPoints-project.devPoints))/3)/project.totalPoints,
                  null,
              ])
           )

          
          this.setState({
            projects: json,
            chartData: projectData,
            height: (120 + (json.length * 30)),
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
  
  componentDidMount() {
    this.refreshState();
  };

  

	render() {
    const buttonStyle = {
      backgroundColor: '#66c2ff',
      borderRadius : '10px',
      borderWidth: '1px',
      textAlign: 'center'
    }
    const tabStyle = {
      marginLeft : '100px',
      marginRight : '100px',
    }
  	return (
    	<div>
        <div><h1 style={{textAlign: "center"}}>{this.props.title}</h1></div>

        {this.state.projects.length === 0 ? <div/> : <div class = 'code'><CapChart className = "code" height = {this.state.height} data={this.state.chartData} refreshState = {this.refreshState}/></div>}

        <div> <p style = {{color: 'white'}}>________________________________________________________________________________________<button style = {buttonStyle} onClick = {this.toggleLegend}>{this.state.showLegend ? 'Hide' : 'Show'} Legend</button></p>
        {this.state.showLegend ? <Legend /> : <span/>}</div>
        
        <Tabs style = {tabStyle}>
            <TabList>
              <Tab>Employees</Tab>
              {this.state.projects.map(project => <Tab key = {project.id}>{project.title}</Tab>)}
              <Tab>+</Tab>
            </TabList>
            <TabPanel>
              <EmployeeCollapsable 
                employees = {this.state.employees}
                allocations = {this.state.allocations}
                projects = {this.state.projects}
                refreshState = {this.refreshState}
              />
              {/* {this.state.employees.map(employee =>
               <div key = {employee.id} style = {{backgroundColor : '#eeddd3'}}>{employee.name}<br/>
                {this.state.allocations.filter(allocation =>
                  allocation.employeeId === employee.id)
                  .map(allocation => 
                    <div key = {allocation.id} style = {{backgroundColor : '#d3e4ee'}}>{this.state.monthNames[new Date(allocation.startDate).getMonth()]} {allocation.startDate.substring(0, 4)} - {this.state.monthNames[new Date(allocation.endDate).getMonth()]} {allocation.endDate.substring(0, 4)} Project : {this.state.projects.filter(project => project.id === allocation.projectId)[0].title} Role : {allocation.role}
                      </div>               
                  )}
              </div>)}
              <div><span>Employee: </span><span><input></input></span></div> */}
            </TabPanel>
            {this.state.projects.map(project => <TabPanel key = {project.id}>
              
              <div>
              <Project 
              monthNames = {this.state.monthNames}
              refreshState = {this.refreshState} 
              employees = {this.state.employees} 
              allocationState = {this.state.allocations}  
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
