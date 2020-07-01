import * as React from "react";

const EmployeeList = (props) => (
	<div>
  	{props.employees.map(employee => <Employee {...employee}/>)}
	</div>
);

class Employee extends React.Component {
	render() {
  	const employee = this.props;
  	return (
    	<div>
          <div>Employee: {employee.name} Role: {employee.role} Month: {employee.month} Allocation: {employee.allocation} Weight: {employee.weight}</div>
    	</div>
    );
  }
}

export default EmployeeList;
//export default Employee;