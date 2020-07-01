import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CapChart from './CapChart';
import Form from './Form';
import EmployeesList from './EmployeeList';
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
  state = {
    projects: [], employees: []
  };

  addAllocation = (employeeData) => {
  	this.setState(prevState => ({
    	employees: [...prevState.employees, employeeData],
    }));
  };
	render() {
  	return (
    	<div>
    	  <div><h1 style={{textAlign: "center"}}>{this.props.title}</h1></div>
        <CapChart data={projectData} />
        <Form addAllocation={this.addAllocation}/>
        <EmployeesList employees={this.state.employees}/>
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
