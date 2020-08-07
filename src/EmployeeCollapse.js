import * as React from "react";
import { API_ROOT } from './api-config';
import './index.css'
import{ Allocation }from './AlloCollapse';


class EmployeeCollapsable extends React.Component {
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
  
  renderItem(employee) {
      const clickCallback = () => this.handleRowClick(employee.id);
      const itemRows = [
      <tr key1={employee.id} class = "noBorder" colSpan = "4">
        <Employee
          employee = {employee}
          refreshState = {this.props.refreshState}
          onClick = {clickCallback}
        />
      </tr>
      ];
      
      if(this.state.expandedRows.includes(employee.id)) {
              itemRows.push(
                  <tr key1 = {employee.id} >
                      <th>Start Month</th>
                      <th>End Month</th>
                      <th>Project</th>
                      <th>Allocation</th>
                      <th>Weight</th>
                      <th>Role</th>
                  </tr>
              )
              this.props.allocations.filter(allocation =>
              allocation.employeeId === employee.id )
              .map(allocation => 
                  itemRows.push(
                    <Allocation 
                      key = {allocation.id} 
                      key1 = {employee.id} 
                      refreshState = {this.props.refreshState} 
                      employees = {this.props.employees} 
                      isEmTab = {true}
                      projects = {this.props.projects}
                      {...allocation}
                    />   
                  )    
              )
      }
      
      return itemRows;    
  }
  
  render() {
      let allItemRows = [];

      this.props.employees.map(employee => {

              const perItemRows = this.renderItem(employee);
              allItemRows = allItemRows.concat(perItemRows);

      }
      )
      
      return (
        <div>
          <table rules = 'all'>
                    {allItemRows}
          </table>
          <EmployeeForm 
          refreshState = {this.props.refreshState}
          isEditing = {false} />
        </div>
      );
  }
}


class Employee extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
          isEditing: false,
      }
      this.deleteEmployee = this.deleteEmployee.bind(this);
      this.toggleEdit = this.toggleEdit.bind(this);
  }

  toggleEdit() {
      this.setState ({
          isEditing: !this.state.isEditing,
          name: ''
      })
  }

  async deleteEmployee(id) {
      if(window.confirm('Are you sure')) {     
          try { 
              const result = await fetch(API_ROOT + 'employees/' + this.props.employee.id, {
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

    if (this.state.isEditing) {
      return (
          <tr key1 = {this.props.key1} class="noBorder">
              <th colSpan = "1">
              <EmployeeForm 
                  refreshState = {this.props.refreshState}
                  isEditing = {this.state.isEditing} 
                  toggleEdit = {this.toggleEdit}
                  id = {this.props.employee.id}
                  name = {this.props.employee.name}
              />
              </th>
          </tr>
      )
    }
    else {
      return (
          <tr key1 = {this.props.key1} class = "noBorder">
              <th><u>{this.props.employee.name}</u></th>
              <th>
                  <button onClick = {this.toggleEdit}>Edit</button>
                  <button onClick={this.deleteEmployee}><img src="https://icon-library.com/images/delete-icon-png-16x16/delete-icon-png-16x16-21.jpg" alt = "" width="12" height="12"/></button>
                  <button onClick={this.props.onClick}>+</button>
              </th>
          </tr>
      );
    }
  
}
}

class EmployeeForm extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        name: ''
      }
      this.postEmployee = this.postEmployee.bind(this);
      this.putEmployee = this.putEmployee.bind(this);
      this.fillState = this.fillState.bind(this);
  }

  changeHandler = (event) => {
      this.setState({[event.target.name]: event.target.value})
  }
  
  async postEmployee(event) {
      event.preventDefault();
      try { 
          fetch(API_ROOT + 'employees', {
              method: 'post',
              headers: {
                  'Accept': 'application/json',
                  'Content-type':'application/json',
              },
              body: JSON.stringify({
                  name: this.state.name,
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

  async putEmployee(event) {
      event.preventDefault();
      try {
          await fetch(API_ROOT + 'employees/' + this.props.id, {
              method: 'put',
              headers: {
                  'Accept': 'application/json',
                  'Content-type':'application/json',
              },
              body: JSON.stringify({
                  id: this.props.id,
                  name: this.state.name
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
      this.setState({
          name : this.props.name
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
              onSubmit={this.props.isEditing ? this.putEmployee : this.postEmployee} 
              //style={{backgroundColor: this.props.isEditing ? 'white' :'#d3eedd'}}
          >
    <label >Employee: </label>
          <input type="text"
          name = 'name'
          autoComplete = "off"
          value = {this.state.name}
          onChange = {this.changeHandler}
          required/>
          {this.props.isEditing ? <span><button onClick = {this.props.toggleEdit}>Cancel</button><button type = 'submit'>Confirm</button></span> : <button type = 'submit'>Add Employee</button>}
    </form>
    </div>
    );
  }
}



export default EmployeeCollapsable;