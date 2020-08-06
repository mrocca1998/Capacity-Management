import * as React from "react";
import AllocationForm from "./AllocationList";
import { API_ROOT } from './api-config';
import './index.css'

class AlloCollapsable extends React.Component {
    constructor() {
        super();
        
        this.state = {
            expandedRows : []
        };
        this.renderItem = this.renderItem.bind(this);
    }

    handleRowClick(rowId) {
        const currentExpandedRows = this.state.expandedRows;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);
        const newExpandedRows = isRowCurrentlyExpanded ? 
			currentExpandedRows.filter(id => id !== rowId) : 
			currentExpandedRows.concat(rowId);
        
        this.setState({expandedRows : newExpandedRows});
    }
    
    renderItem(employee, role) {
        const clickCallback = () => this.handleRowClick(employee.id);
        const itemRows = [
			<tr key={employee.id} class = "noBorder">
			    <td><b><u>{employee.name}, {role}</u></b> <button onClick={clickCallback}>+</button></td><td/><td/><td/>
			</tr>
        ];
        
        if(this.state.expandedRows.includes(employee.id)) {
                itemRows.push(
                    <tr key1 = {employee.id} class = "noTopBorder">
                        <th>Start Month</th>
                        <th>End Month</th>
                        <th>Allocation</th>
                        <th>Weight</th>
                    </tr>
                )
                this.props.allocations.filter(allocation =>
                allocation.role === role
                && allocation.employeeId === employee.id 
                && allocation.projectId === this.props.projectId)
                .map(allocation => 
                    itemRows.push(
                    <Allocation key = {allocation.id} refreshState = {this.props.refreshState} employees = {this.props.employees} {...allocation}/>   
                    )    
                )
        }
        
        return itemRows;    
    }
    
    render() {
        let allItemRows = [];

        this.props.employees.map(employee =>
            ['BA', 'QA', 'Dev'].map(role => {
                if (
                    this.props.allocations.filter(
                    allocation => (allocation.role === role
                    && allocation.employeeId === employee.id
                    && allocation.projectId === this.props.projectId)).length > 0
                ) {
                const perItemRows = this.renderItem(employee, role);
                allItemRows = allItemRows.concat(perItemRows);
                }
                return <span/>
            }              
            )
        )
        
        return (
			    <table rules = 'all'>
                     {allItemRows}
                </table>
        );
    }
}


class Allocation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isEditing: false,
            monthNames : ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ]
        }
        this.deleteAllocation = this.deleteAllocation.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    toggleEdit() {
        this.setState ({
            isEditing: !this.state.isEditing
        })
    }

    async deleteAllocation(id) {
        if(window.confirm('Are you sure')) {     
            try { 
                const result = await fetch(API_ROOT + 'allocations/' + this.props.id, {
                    method: 'delete',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type':'application/json',
                    }
                })
    
                console.log('Result ' + result)
            } catch (e) {
                console.log(e)
            }
            this.props.refreshState();
        }
    }

 	render() {
      const allocation = this.props;

      if (this.state.isEditing) {
        return (
            <tr>
                <td colSpan = "5">
                <AllocationForm 
                    refreshState = {this.props.refreshState}
                    employees = {this.props.employees}
                    isEditing = {this.state.isEditing} 
                    toggleEdit = {this.toggleEdit}
                    id = {allocation.id}
                    projectId = {allocation.projectId}
                    employeeId = {allocation.employeeId}
                    role = {allocation.role}
                    startDate = {allocation.startDate}
                    endDate = {allocation.endDate}
                    allocation = {allocation.allocation1}
                    weight = {allocation.workWeight}
                />
                </td>
            </tr>
        )
      }
      else {
        return (
            <tr>
                <td>{this.state.monthNames[new Date(allocation.startDate).getMonth()]} {allocation.startDate.substring(0, 4)}</td>
                <td>{this.state.monthNames[new Date(allocation.endDate).getMonth()]} {allocation.endDate.substring(0, 4)}</td>
                <td>{allocation.allocation1}%</td>
                <td>{allocation.workWeight}</td>
                <td>
                    <button onClick = {this.toggleEdit}>Update</button>
                    <button onClick={this.deleteAllocation}><img src="https://icon-library.com/images/delete-icon-png-16x16/delete-icon-png-16x16-21.jpg" alt = "" width="12" height="12"/></button>          
                </td>
            </tr>
                //* Months: {this.state.monthNames[new Date(allocation.startDate).getMonth()]} {allocation.startDate.substring(0, 4)} - {this.state.monthNames[new Date(allocation.endDate).getMonth()]} {allocation.endDate.substring(0, 4)} Allocation: {allocation.allocation1}%
                //Weight: {allocation.workWeight} */}
                //{/* <button onClick = {this.toggleEdit}>Update</button>
                //<button onClick={this.deleteAllocation}><img src="https://icon-library.com/images/delete-icon-png-16x16/delete-icon-png-16x16-21.jpg" alt = "" width="12" height="12"/></button> */}
        );
      }
  	
  }
}

export default AlloCollapsable;