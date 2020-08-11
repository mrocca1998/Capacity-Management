import * as React from "react";
import { API_ROOT } from './api-config';
import './tables.css'


class AllocationForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            employee : this.props.employees.length > 0 ? this.props.employees[0].name: '',
            role: 'BA',
            startDate : '',
            endDate : '',
            allocation: 100,
            weight : '1',
        }
        this.postAllocation = this.postAllocation.bind(this);
        this.putAllocation = this.putAllocation.bind(this);
        this.putAllocationCheck = this.putAllocationCheck.bind(this);
        this.fillState = this.fillState.bind(this);
    }

    changeHandler = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }
    
    async postAllocation(event) {
        event.preventDefault();
        try {
            fetch(API_ROOT + 'allocations', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type':'application/json',
                },
                body: JSON.stringify({
                    projectId: this.props.projectId,
                    employeeId: 
                    this.props.employees.filter(employee => employee.name === this.state.employee)[0].id,
                    role: this.state.role,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    allocation1: this.state.allocation,
                    workWeight: this.state.weight,
                })
            })
            .then(result => result.json())
            .then(json => {
                if (json.length > 0) {
                    alert(json);
                }  
                this.props.refreshState();     
            })
        } catch (e) {
            console.log(e)
        }
        this.props.refreshState();
    }

    async putAllocation(event) {
        try {
            await fetch(API_ROOT + 'allocations/' + this.props.id, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-type':'application/json',
                },
                body: JSON.stringify({
                    id: this.props.id,
                    projectId: this.props.projectId,
                    employeeId:this.props.employees.filter(employee => employee.name === this.state.employee)[0].id,
                    role: this.state.role,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    allocation1: this.state.allocation,
                    workWeight: this.state.weight,
                })
            })
            .then(result => result.json())
            .then(json => {
                if (json.length > 0) {
                    alert(json);
                }  
                else {
                    this.props.toggleEdit();
                }
                this.props.refreshState();   
                this.props.sortAllocations();   
  
            })
        } catch (e) {
            console.log(e)
        }
        this.props.refreshState();   
    }

    async putAllocationCheck(event) {
        event.preventDefault();
        try {
            await fetch(API_ROOT + 'allocations/Check/' + this.props.id, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-type':'application/json',
                },
                body: JSON.stringify({
                    id: this.props.id,
                    projectId: this.props.projectId,
                    employeeId:this.props.employees.filter(employee => employee.name === this.state.employee)[0].id,
                    role: this.state.role,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    allocation1: this.state.allocation,
                    workWeight: this.state.weight,
                })
            })
            .then(result => result.json())
            .then(json => {
                if (json.length > 0) {
                    alert(json);
                }  
                else {
                    this.putAllocation();
                }
                this.props.refreshState();   
                this.props.sortAllocations();   
  
            })
        } catch (e) {
            console.log(e)
        }
        this.props.refreshState();   
    }

    fillState() {
        var event1 = new Date(this.props.startDate);
        let startDate = JSON.stringify(event1)
        startDate = startDate.slice(1,8)
        var event2 = new Date(this.props.endDate);
        let endDate = JSON.stringify(event2)
        endDate = endDate.slice(1,8)
        this.setState({
            employee : 
            this.props.employees.filter(employee => employee.id === this.props.employeeId)[0].name,
            role: this.props.role,
            startDate : startDate,
            endDate : endDate,
            weight : this.props.weight,
            allocation: this.props.allocation,
            
        })
    }


    componentDidMount() {
        if (this.props.isEditing) {
            this.fillState();
        }
    };

    render() {
        if (this.props.isEditing) {
            return (
                this.props.isEmTab ? 
                    <td colSpan = "7">
                    <form 
                    onSubmit={this.props.isEditing ? this.putAllocationCheck : this.postAllocation} 
                    >
                    {/* <label > Start Month: </label> */}
                    <input type="month" min="2020-07" 
                    name = 'startDate'
                    value = {this.state.startDate}
                    onChange = {this.changeHandler}
                    required
                    style={{width : "145px"}}/>
                    {/* <label > End Month: </label> */}
                    <input type="month" min="2020-07"
                    name = 'endDate'
                    value = {this.state.endDate}
                    onChange = {this.changeHandler}
                    style={{width: "146px"}}/>
                    {/* <br/><label> Allocation: </label> */}
                    <input type = "text"
                    value = {this.props.projects.filter(project => project.id === this.props.projectId)[0].title}
                    class = "emFormThird"
                    readOnly
                    />
                    <input 
                    class = "third"
                    width = "100"
                    type="number" min="0" max="100" step="1" 
                    name = 'allocation'
                    value = {this.state.allocation}
                    onChange = {this.changeHandler}
                    required 
                    />
                    {/* <label> Weight: </label> */}
                    <input
                    class = "fourth"
                    type="number" min=".25" max="1" step=".25" 
                    name = 'weight'
                    value = {this.state.weight}
                    onChange = {this.changeHandler}
                    required 
                    />
                    <select type = "text" 
                    name = 'role'
                    value = {this.state.role}
                    onChange = {this.changeHandler}
                    class = "emFormSixth"
                    required>
                        <option>BA</option>
                        <option>QA</option>
                        <option>Dev</option>
                    </select>
                    {this.props.isEditing ? <span>&nbsp;<button onClick = {this.props.toggleEdit}>Cancel</button>&nbsp;<button type = 'submit'>Confirm</button></span> : <button type = 'submit'>Add Allocation</button>}
                    </form>   
                    </td> 
                :
                    <td class = "form" colspan = "6">
                    <form 
                        onSubmit={this.props.isEditing ? this.putAllocationCheck : this.postAllocation} 
                    >
                    {/* <label > Start Month: </label> */}
                    <input type="month" min="2020-07" 
                    name = 'startDate'
                    value = {this.state.startDate}
                    onChange = {this.changeHandler}
                    required
                    style={{width : "145px"}}/>
                    {/* <label > End Month: </label> */}
                    <input type="month" min="2020-07"
                    name = 'endDate'
                    value = {this.state.endDate}
                    onChange = {this.changeHandler}
                    style={{width: "145px"}}/>
                    {/* <br/><label> Allocation: </label> */}
                    <input 
                    class = "third"
                    type="number" min="0" max="100" step="1" 
                    name = 'allocation'
                    value = {this.state.allocation}
                    onChange = {this.changeHandler}
                    required 
                    />
                    {/* <label> Weight: </label> */}
                    <input 
                    class = "fourth"
                    type="number" min=".25" max="1" step=".25" 
                    name = 'weight'
                    value = {this.state.weight}
                    onChange = {this.changeHandler}
                    required 
                    />
                    <select type = "text" 
                    name = 'role'
                    value = {this.state.role}
                    onChange = {this.changeHandler}
                    class = "emFormSixth"
                    required>
                        <option>BA</option>
                        <option>QA</option>
                        <option>Dev</option>
                    </select>
                    {this.props.isEditing ? <span>&nbsp;<button onClick = {this.props.toggleEdit}>Cancel</button>&nbsp;<button type = 'submit'>Confirm</button></span> : <button type = 'submit'>Add Allocation</button>}
                    </form>    
                    </td>            

            )
        } 
        else {
            return (
                <form 
                    onSubmit={this.props.isEditing ? this.putAllocationCheck : this.postAllocation} 
                >
                <br/>
                <label >Employee: </label>
                <select type="text"
                name = 'employee'
                value = {this.state.employee}
                onChange = {this.changeHandler}
                required>
                {this.props.employees.map(employee =>
                    <option>{employee.name}</option>
                )}
                </select>
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
                <input type="month" min="2020-07" 
                name = 'startDate'
                value = {this.state.startDate}
                onChange = {this.changeHandler}
                required
                style={{width: "145px"}}/>
                <label > End Month: </label>
                <input type="month" min="2020-07"
                name = 'endDate'
                value = {this.state.endDate}
                onChange = {this.changeHandler}
                style={{width: "145px"}}/>
                <br/><label> Allocation: </label>
                <input 
                type="number" min="0" max="100" step="1" 
                name = 'allocation'
                value = {this.state.allocation}
                onChange = {this.changeHandler}
                required 
                />
                <label> Weight: </label>
                <input 
                type="number" min=".25" max="1" step=".25" 
                name = 'weight'
                value = {this.state.weight}
                onChange = {this.changeHandler}
                required 
                />
                {/* <select type = "number" 
                name = 'weight'
                value = {this.state.weight}
                onChange = {this.changeHandler}>
                    <option>1</option>
                    <option>.75</option>
                    <option>.50</option>
                    <option>.25</option>
                </select>         */}
                {this.props.isEditing ? <span><button onClick = {this.props.toggleEdit}>Cancel</button><button type = 'submit'>Confirm</button></span> : <button type = 'submit'>Add Allocation</button>}
                </form>
            )
        }

			// <label >Employee: </label>
            // <input type="text" list="employees"
            // name = 'employee'
            // autoComplete = "off"
            // value = {this.state.employee}
            // onChange = {this.changeHandler}
            // required/>
            // <datalist id="employees">
            //     {this.props.employees.map(employee => <EmployeeDropdown key = {employee.id} {...employee}/>)}
            // </datalist>
            // <label > Role: </label>
            // <select type = "text" 
            // name = 'role'
            // value = {this.state.role}
            // onChange = {this.changeHandler}
            // required>
            //     <option>BA</option>
            //     <option>QA</option>
            //     <option>Dev</option>
            // </select>
            // <br/>
            // <label > Start Month: </label>
            // <input type="month" min="2020-07" 
            // name = 'startDate'
            // value = {this.state.startDate}
            // onChange = {this.changeHandler}
            // required
            // style={{width: "145px"}}/>
            // <label > End Month: </label>
            // <input type="month" min="2020-07"
            // name = 'endDate'
            // value = {this.state.endDate}
            // onChange = {this.changeHandler}
            // style={{width: "145px"}}/>
            // <br/><label> Allocation: </label>
            // <input 
            // type="number" min="0" max="100" step="1" 
            // name = 'allocation'
            // value = {this.state.allocation}
            // onChange = {this.changeHandler}
            // required 
            // />
            // <label> Weight: </label>
            // <input 
            // type="number" min=".25" max="1" step=".25" 
            // name = 'weight'
            // value = {this.state.weight}
            // onChange = {this.changeHandler}
            // required 
            // />
            // {/* <select type = "number" 
            // name = 'weight'
            // value = {this.state.weight}
            // onChange = {this.changeHandler}>
            //     <option>1</option>
            //     <option>.75</option>
            //     <option>.50</option>
            //     <option>.25</option>
            // </select>         */}
            // {this.props.isEditing ? <span><button onClick = {this.props.toggleEdit}>Cancel</button><button type = 'submit'>Confirm</button></span> : <button type = 'submit'>Add Allocation</button>}
			// </form>
		}
	}

// class EmployeeDropdown extends React.Component {
// 	render() {
//   	const employee = this.props;
//   	return (
//         <option>{employee.name}</option>
//     );
//   }
// }

export default AllocationForm;