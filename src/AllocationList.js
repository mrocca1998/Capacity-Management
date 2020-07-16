import * as React from "react";
import EmployeeList from './EmployeeList'

class AllocationList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            employee : '',
            role: 'BA',
            startMonth : '',
            endMonth : '',
            allocation: '',
            weight : ''
        }
        this.postAllocation = this.postAllocation.bind(this);
    }

    changeHandler = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }
    
    async postAllocation(event) {
        event.preventDefault();
        try { 
            if (this.props.employees.filter(employee => employee.name === this.state.employee).length === 0) {
                try { 
                    const emResult = await fetch('https://localhost:44391/api/employees', {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json',
                            'Content-type':'application/json',
                        },
                        body: JSON.stringify({
                            name : this.state.employee,
                            role : this.state.role
                        })
                    });
        
                    console.log('Result ' + emResult)
                } catch (e) {
                    console.log(e)
                }
                this.props.refreshState();
            }
            const alResult = await fetch('https://localhost:44391/api/allocations', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type':'application/json',
                },
                body: JSON.stringify({
                    projectId: this.props.projectId,
                    employeeId: 
                    this.props.employees.filter(employee => employee.name === this.state.employee)[0].id,
                    startDate: this.state.startMonth,
                    endDate: this.state.endMonth,
                    allocation1: this.state.allocation,
                    workWeight: this.state.weight,
                    role: this.state.role
                })
            });

            console.log('Result ' + alResult)
        } catch (e) {
            console.log(e)
        }
        this.props.refreshState();
    }
    render() {
        return (
			<div>
            <EmployeeList refreshState = {this.props.refreshState} projectId = {this.props.projectId} employees = {this.props.employees} allocations = {this.props.allocations} addAllocation = {this.props.addAllocation}/>
			<form onSubmit={this.postAllocation} style = {{backgroundColor : '#d3eedd'}}>
			<label >Employee: </label>
            <input type="text" list="employees"
            name = 'employee'
            value = {this.state.employee}
            onChange = {this.changeHandler}/>
            <datalist id="employees">
                {this.props.employees.map(employee => <EmployeeDropdown {...employee}/>)}
            </datalist>
            <label > Role: </label>
            <select type = "text" 
            name = 'role'
            value = {this.state.role}
            onChange = {this.changeHandler}
            required>
                <option>BA</option>
                <option>QA</option>
                <option>Dev</option>
            </select>
            <label > Start Month: </label>
            <input type="month" min="2020-07" defaultValue="2020-07" 
            name = 'startMonth'
            value = {this.state.startMonth}
            onChange = {this.changeHandler}
            required/>
            <label > End Month: </label>
            <input type="month" min="2020-07" defaultValue="2020-07" 
            name = 'endMonth'
            value = {this.state.endMonth}
            onChange = {this.changeHandler}/>
            <label> Allocation: </label>
            <input 
            type="number" min="0" max="1" step="0.01" 
            name = 'allocation'
            value = {this.state.allocation}
            onChange = {this.changeHandler}
            required 
            />
            <label> Weight: </label>
            <select type = "text" 
            name = 'weight'
            value = {this.state.weight}
            onChange = {this.changeHandler}>
                <option>.25</option>
                <option>.5</option>
                <option>.75</option>
                <option>1</option>
            </select>        
            <button type = 'submit'>Add Allocation</button>
			</form>
			</div>
			);
		}
	}

class EmployeeDropdown extends React.Component {
	render() {
  	const employee = this.props;
  	return (
        <option>{employee.name}</option>
    );
  }
}

export default AllocationList;