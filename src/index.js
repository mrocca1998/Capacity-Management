import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CapChart from './CapChart';
import ProjectsList from './ProjectsList';
import * as serviceWorker from './serviceWorker';

const projectData = [
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
    [
      'EEL',
      'EEL',
      null,
      new Date(2020, 5, 1),
      new Date(2020, 7, 14),
      null,
      100,
      null,
    ],
    [
      'Umbrella',
      'Umbrella',
      null,
      new Date(2020, 3, 21),
      new Date(2020, 9, 20),
      null,
      100,
      null,
    ],
    [
      'North Carolina',
      'North Carolina',
      null,
      new Date(2020, 6, 21),
      new Date(2020, 10, 20),
      null,
      100,
      null,
    ],
  ];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [[
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'string', label: 'Resource' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
      ], ], projects: [], allocations: [], employees: []
    };
  }
  refreshState = () => {
    fetch('https://localhost:44391/api/projects')
      .then(res => res.json())
      .then(json => {
          this.setState({
              projects: json,
          });
        },
      )
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
  }
  addProjectData = (id, title, startDate) => {
    fetch('https://localhost:44391/api/projects/duration/' + id)
    .then(res => res.json())
    .then(json => {
        this.setState(prevState => ({
        data: [...prevState.data, [
          id,
          title,
          null,
          startDate,
          json.projectEndDate,
          null,
          100,
          null,
          ]
        ],
        }));
      },
    )
  } 

  removeProjectData = (id) => {
    const newData = [];
    newData.push(this.state.data[0])
    this.setState({
      data: newData.push(this.state.data.slice(1).filter(project => project[0] !== id))
    });
  }
  
  componentDidMount() {
    this.refreshState();
  };

	render() {
  	return (
    	<div>
        <div><h1 style={{textAlign: "center"}}>{this.props.title}</h1></div>
        <CapChart data={projectData} />
        {this.state.loading ? <div>loading...</div> : <ProjectsList allocations = {this.state.allocations} employees = {this.state.employees} projects = {this.state.projects} refreshState={this.refreshState} addAllocation={this.addAllocation} addEmployee={this.addEmployee}/>}
    	</div>
    );
  }	
}

ReactDOM.render(
  <App title = 'Personal Lines Capacity Management'/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
