import * as React from "react";
import AllocationForm from "./AllocationList";


class EmployeeList extends React.Component {

    render() {
        return (
			<div style = {{backgroundColor : '#eeddd3'}}>
                  {this.props.employees.map(employee =>
                    ['BA', 'QA', 'Dev'].map(role => {
                        if (
                            this.props.allocations.filter(
                            allocation => (allocation.role === role
                            && allocation.employeeId === employee.id
                            && allocation.projectId === this.props.projectId)).length > 0
                        )
                        return <div key = {employee.id}>
                            {employee.name} {role}
                            {this.props.allocations.filter(allocation =>
                                allocation.role === role
                                && allocation.employeeId === employee.id 
                                && allocation.projectId === this.props.projectId)
                                .map(allocation => <Allocation key = {allocation.id} refreshState = {this.props.refreshState} employees = {this.props.employees} {...allocation}/>                
                                )}
                        </div> 
                        
                        return <span key = {role}/>;
                    }              
                    )
                )}
			</div>		
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
                const result = await fetch('https://localhost:44391/api/allocations/' + this.props.id, {
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
            <div>
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
            </div>
        )
      }
      else {
        return (
            <div style = {{backgroundColor : '#eeddd3'}}>
                Months: {this.state.monthNames[new Date(allocation.startDate).getMonth()]} {allocation.startDate.substring(0, 4)} - {this.state.monthNames[new Date(allocation.endDate).getMonth()]} {allocation.endDate.substring(0, 4)} Allocation: {allocation.allocation1}%
                Weight: {allocation.workWeight}
                <button onClick = {this.toggleEdit}>Update</button>
                <button onClick={this.deleteAllocation}><img src="https://icon-library.com/images/delete-icon-png-16x16/delete-icon-png-16x16-21.jpg" alt = "" width="12" height="12"/></button>
            </div>
        );
      }
  	
  }
}
export default EmployeeList;