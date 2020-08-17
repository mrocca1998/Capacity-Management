import * as React from "react";
import AllocationForm from "./AllocationForm";
import { API_ROOT } from './api-config';
import './tables.css'

class AlloCollapsable extends React.Component {
    constructor(props) {
        super(props);
        const projectArray = this.props.projectRows[this.props.projectName];
        
        this.state = {
            expandedRows : projectArray
        };
        this.renderItem = this.renderItem.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.sortAllocations = this.sortAllocations.bind(this);
    }

    handleRowClick(rowId) {
        const currentExpandedRows = this.state.expandedRows;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

        isRowCurrentlyExpanded ? 
        this.props.collapseProjectRow(rowId, this.props.projectName) :
        this.props.expandProjectRow(rowId, this.props.projectName);
        
        const newExpandedRows = isRowCurrentlyExpanded ? 
        currentExpandedRows.filter(id => id !== rowId) : 
        currentExpandedRows.concat(rowId);

        this.setState({expandedRows : newExpandedRows});
    }
    
    renderItem(employee, role) {
        const clickCallback = () => this.handleRowClick(employee.id + role);
        const itemRows = [
			<tr key1={employee.id + role} class = "noBorder">
			    <th style = {{width: "300px"}} colspan = "3">{employee.name} <button onClick={clickCallback} class = "Aes">{this.state.expandedRows.includes(employee.id + role) ? '-':'+'}</button></th><br/>
                <br/>
			</tr>
        ];
        
        if(this.state.expandedRows.includes(employee.id + role)) {
                itemRows.push(
                    <tr key1 = {employee.id + role} class = "alloTable">
                        <th class = "first">Start Month</th>
                        <th class = "second">End Month</th>
                        <th class = "third">Allocation</th>
                        <th class = "fourth">Weight</th>
                        <th class = "emFifth">Role</th>
                        <th class = "fifth" style = {{backgroundColor: '#ffffff00'}}></th>
                    </tr>
                )
                this.props.allocations.filter(allocation =>
                allocation.role === role
                && allocation.employeeId === employee.id 
                && allocation.projectId === this.props.projectId)
                .map(allocation => 
                    itemRows.push(
                    <Allocation 
                        key = {allocation.id} 
                        key1 = {employee.id + role} 
                        refreshState = {this.props.refreshState} 
                        employees = {this.props.employees} 
                        sortAllocations = {this.sortAllocations}
                        {...allocation}
                    />   
                    )    
                )
        }
        
        return itemRows;    
    }

    sortAllocations() {
        this.props.allocations.sort((a, b) => (new Date(a.startDate) >= new Date(b.startDate)) ? 1 : -1)
    }

    componentDidMount () {
        this.sortAllocations();
    };
    
    render() {
        let allItemRows = [];
        this.sortAllocations();
        this.props.employees.map(employee => {
            // ['BA', 'QA', 'Dev'].map(role => {
                if (
                    this.props.allocations.filter(
                    allocation => (allocation.role === this.props.role
                    && allocation.employeeId === employee.id
                    && allocation.projectId === this.props.projectId)).length > 0
                ) {
                const perItemRows = this.renderItem(employee, this.props.role);
                allItemRows = allItemRows.concat(perItemRows);
                }
                return (
                    <span/>
                )
            // }              
            // )
        })
        
        return (
			    <table rules = 'all' class = "alloTable2">
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
        if(window.confirm('Are you sure you want to delete this allocation for ' + this.props.employees.filter(employee => employee.id = this.props.employeeId)[0].name + '?')) {     
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
            <tr key1 = {this.props.key1} class = "form">  
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
                    isEmTab = {this.props.isEmTab}
                    projects = {this.props.projects}
                    sortAllocations = {this.props.sortAllocations}
                />
            </tr>
        )
      }
      else {
        return (
            this.props.isEmTab ? 
                <tr height = '27px' class = "alloTable">
                    <td>{this.state.monthNames[new Date(allocation.startDate).getMonth()]} {allocation.startDate.substring(0, 4)}</td>
                    <td>{this.state.monthNames[new Date(allocation.endDate).getMonth()]} {allocation.endDate.substring(0, 4)}</td>
                    <td>{this.props.projects.filter(project => project.id === allocation.projectId)[0].title}</td>
                    <td>{allocation.allocation1}%</td>
                    <td>{allocation.workWeight}</td>
                    <td class = "sixth">{allocation.role}</td>
                    <td class = "seventh" >
                        <span>
                        &nbsp;<button onClick = {this.toggleEdit} class = "Aes"><img src="https://cdn.pixabay.com/photo/2019/04/08/20/26/pencil-4112898_1280.png" alt = "" width="12" height="12"/></button>
                        <button onClick={this.deleteAllocation} class ="Aes"><img src="https://icon-library.com/images/delete-icon-png-16x16/delete-icon-png-16x16-21.jpg" alt = "" width="12" height="12"/></button>   
                        </span>       
                    </td>
                </tr>
            :
                <tr key1 = {this.props.key1} height = '27px' class = "alloTable">
                    <td>{this.state.monthNames[new Date(allocation.startDate).getMonth()]} {allocation.startDate.substring(0, 4)}</td>
                    <td>{this.state.monthNames[new Date(allocation.endDate).getMonth()]} {allocation.endDate.substring(0, 4)}</td>
                    <td>{allocation.allocation1}%</td>
                    <td>{allocation.workWeight}</td>
                    <td class = "sixth">{allocation.role}</td>
                    <td class = "fifth">
                        &nbsp;<button onClick = {this.toggleEdit} class = "Aes"><img src="https://cdn.pixabay.com/photo/2019/04/08/20/26/pencil-4112898_1280.png" alt = "" width="12" height="12"/></button>
                        <button onClick={this.deleteAllocation} class = "Aes"><img src="https://icon-library.com/images/delete-icon-png-16x16/delete-icon-png-16x16-21.jpg" alt = "" width="12" height="12"/></button>          
                    </td>
                </tr>
        );
      }
  	
  }
}

export {AlloCollapsable, Allocation, };