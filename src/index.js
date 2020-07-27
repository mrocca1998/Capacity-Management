import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import CapChart from './CapChart';
import BreakdownChart from './BreakdownChart';
import ProjectsList, {ProjectForm, Project} from './ProjectsList';
import * as serviceWorker from './serviceWorker';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


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
    marginRight : 'auto'
  }
  return <table alight = 'center' rules ='all' 
  style = {tableStyle}>
 <tr>
    <th width = '20'>Weight</th>
    <th width = '30'>Description</th>
    <th width = '50'>Hours per point</th>
  </tr>
  <tr>
    <td>.25</td>
    <td>Lead, not much direct work</td>
    <td>65</td>
  </tr>
  <tr>
    <td>.50</td>
    <td>New Employee</td>
    <td>30</td>
  </tr>
  <tr>
    <td>.75</td>
    <td>Progressing towards full capacity or also mentoring junior members</td>
    <td>16</td>
  </tr>
  <tr>
    <td>1</td>
    <td>Full capactiy</td>
    <td>8</td>
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
      ], projects: [], allocations: [], employees: [],
    };
  }
  refreshState = () => {
      fetch('https://localhost:44391/api/projects')
      .then(res => res.json())
      .then(json => {
          const projectData = [this.state.chartData[0],];

          json.map(project =>
              projectData.push([
                  project.id,
                  project.title,
                  null,
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
          });
        }
        
      )
      this.setState({
        empty: this.state.projects.length === 1
      });
      fetch('https://localhost:44391/api/employees')
      .then(res => res.json())
      .then(json => {
          this.setState({
              employees: json
          });
        },
      )
      fetch('https://localhost:44391/api/allocations')
      .then(res => res.json())
      .then(json => {
          this.setState({
              allocations: json,
              });
        },
      )   
      // this.setState({
      //   isEmpty: this.state.projects.length === 0
      // })
  }
  
  componentDidMount() {
    this.refreshState();
  };

	render() {
  	return (
    	<div>
        <div><h1 style={{textAlign: "center"}}>{this.props.title}</h1></div>

        {this.state.projects.length === 0 ? <div/> : <CapChart data={this.state.chartData} />}

        <ProjectForm 
          isEditing = {false}
          allocations = {this.state.allocations} 
          employees = {this.state.employees} 
          projects = {this.state.projects} 
          refreshState={this.refreshState}
        />

        <Legend />
        
        <Tabs deafultIndex={0}>
            <TabList>
              <Tab>Employees</Tab>
              {this.state.projects.map(project => <Tab>{project.title}</Tab>)}
            </TabList>
            <TabPanel>
              {this.state.employees.map(employees => <div>{employees.name}<br/></div>)}
            </TabPanel>
            {this.state.projects.map(project => <TabPanel>
              <div>
              <Project
              refreshState = {this.refreshState} 
              employees = {this.state.employees} 
              allocationState = {this.state.allocations}  
              {...project}/>
              <BreakdownChart chartSettings = {[
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
          </Tabs  >

        {/* {this.state.projects.map(project => <Project
          refreshState = {this.refreshState} 
          employees = {this.state.employees} 
          allocationState = {this.state.allocations}  
        {...project}/>)}
        
        <ProjectForm 
          isEditing = {false}
          allocations = {this.state.allocations} 
          employees = {this.state.employees} 
          projects = {this.state.projects} 
          refreshState={this.refreshState}
        />


        <Legend />

        {this.state.projects.map(project => <BreakdownChart chartSettings = {[
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'string', label: 'Resource' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
        ]} {...project}/>)} */}

      </div>

      
    );
  }	
}

ReactDOM.render(
  <App title = 'Webteam Capacity Management'/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
