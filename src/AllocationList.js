import * as React from "react";

class AllocationForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            employee : '',
            role: 'BA',
            startDate : '',
            endDate : '',
            allocation: 100,
            weight : '1'
        }
        this.postAllocation = this.postAllocation.bind(this);
        this.putAllocation = this.putAllocation.bind(this);
        this.fillState = this.fillState.bind(this);
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
            fetch('https://localhost:44391/api/allocations', {
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
        event.preventDefault();
        try {
            await fetch('https://localhost:44391/api/allocations/' + this.props.id, {
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
            allocation: this.props.allocation,
            weight : this.props.weight
        })
    }

    componentDidMount() {
        if (this.props.isEditing) {
            this.fillState();
        }
    };

    render() {
        return (
			<div>
            <form 
                onSubmit={this.props.isEditing ? this.putAllocation : this.postAllocation} 
                style={{backgroundColor: this.props.isEditing ? '#eeddd3' :'#d3eedd'}}
            >
			<label >Employee: </label>
            <input type="text" list="employees"
            name = 'employee'
            autoComplete = "off"
            value = {this.state.employee}
            onChange = {this.changeHandler}
            required/>
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
            <label> Allocation: </label>
            <input 
            type="number" min="0" max="100" step="0.01" 
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
                <option>1</option>
                <option>.75</option>
                <option>.50</option>
                <option>.25</option>
            </select>        
            {this.props.isEditing ? <span><button onClick = {this.props.toggleEdit}>Cancel</button><button type = 'submit'>Confirm</button></span> : <button type = 'submit'>Add Allocation</button>}
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

export default AllocationForm;