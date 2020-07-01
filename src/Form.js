import * as React from "react";
import CapChart from "./CapChart";
import EmployeeList from "./EmployeeList";

class Form extends React.Component {
    employee = React.createRef();
    role = React.createRef();
    month = React.createRef();
    allocation = React.createRef();
    weight = React.createRef();
    addNewAllocation = (event) => {
        event.preventDefault();
        const allocationData = {'name': this.employee.current.value, 'role': this.role.current.value, 'month': this.role.current.value, 'allocation': this.allocation.current.value, 'weight': this.weight.current.value,}; 
        this.props.addAllocation(allocationData);
    }
    handleSubmit = (event) => {
        event.preventDefault();
    }
    render() {

        return (
            <form style={{textAlign: "center"}}>
            <h1>Add a Project</h1>
            <label>Project Title: </label>
            <input 
            type="text"
            ref = {this.title}
            required 
            />

            {/* Dates */}
            <br /><br /><label>Start Date: </label>
            <input 
            type="date"
            ref = {this.startDate}
            required 
            />
            <label> End Date: </label>
            <input 
            type="date"
            ref = {this.endDate}
            required 
            />

            
            {/* Points */}
            <br /><br /><label>BA Points: </label>
            <input 
            type="number"
            ref = {this.baPoints}
            required 
            />
            <label> QA Points: </label>
            <input 
            type="number"
            ref = {this.qaPoints}
            required 
            />
            <label > Developer Points: </label>
            <input 
            type="number"
            ref = {this.devPoints}
            required 
            />


            {/* Allocation */}
            <br /><br /><label>Employee: </label>
            <input type="text" list="employees" ref={this.employee}/>
            <datalist id="employees">
                <option>Michael</option>
                <option>Travis</option>
                <option>Julie</option>
                <option>Charlie</option>
            </datalist>
            <label > Role: </label>
            <select type = "text" ref={this.role}>
                <option>BA</option>
                <option>QA</option>
                <option>Developer</option>
            </select>
            <label > Month: </label>
            <input type="month" min="2020-07" defaultValue="2020-07" ref={this.month}/>
            <label> Allocation: </label>
            <input 
            type="number" min="0" max="1" step="0.01" 
            ref = {this.allocation}
            required 
            />
            <label> Weight: </label>
            <input 
            type="number" min="0" max="1" step="0.01" 
            ref = {this.weight}
            required 
            />         
            <br /><br/><button onClick={this.addNewAllocation}>Add Allocation</button>
            <br /><br/><button onClick={this.handleSubmit}>Add Project</button>
            </form>
        );
    }
}

export default Form;