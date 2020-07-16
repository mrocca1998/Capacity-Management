import * as React from "react";

class EmployeeList extends React.Component {

    render() {
        return (
			<div style = {{backgroundColor : '#eeddd3'}}>
                  {this.props.employees.map(employee => 
                    ['Dev', 'BA', 'QA'].map(role => {
                        if (
                            this.props.allocations.filter(
                            allocation => (allocation.role === role
                            && allocation.employeeId === employee.id
                            && allocation.projectId === this.props.projectId)).length > 0
                        )
                        return <div>
                            {employee.name} {role}
                            {this.props.allocations.filter(allocation =>
                                allocation.role === role
                                && allocation.employeeId === employee.id 
                                && allocation.projectId === this.props.projectId)
                                .map(allocation => <Allocation refreshState = {this.props.refreshState} {...allocation}/>                
                                )}
                        </div>   
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
        this.deleteAllocation = this.deleteAllocation.bind(this);
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
  	return (
    	<div style = {{backgroundColor : '#eeddd3'}}>
          Months: {allocation.startDate.substring(5, 7)}/{allocation.startDate.substring(0, 4)} - {allocation.endDate.substring(5, 7)}/{allocation.endDate.substring(0, 4)} Weight: {allocation.workWeight} Allocation: {parseFloat(allocation.allocation1 * 100)}%
          <button onClick={this.deleteAllocation}>Delete Allocation</button>
    	</div>
    );
  }
}
export default EmployeeList;