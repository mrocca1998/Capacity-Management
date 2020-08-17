import * as React from "react";
import { API_ROOT } from './api-config';
import './index.css'
import{ Allocation }from './AlloCollapse';


class EmployeeCollapsable extends React.Component {
  constructor(props) {
      super(props);
      
      this.state = {
          expandedRows : this.props.employeeRows
      };
      this.renderItem = this.renderItem.bind(this);
      this.handleRowClick = this.handleRowClick.bind(this);
  }

  handleRowClick(rowId) {
      const currentExpandedRows = this.state.expandedRows;
      const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

      isRowCurrentlyExpanded ? 
      this.props.collapseEmRow(rowId) :
      this.props.expandEmRow(rowId);
      
      const newExpandedRows = isRowCurrentlyExpanded ? 
      currentExpandedRows.filter(id => id !== rowId) : 
      currentExpandedRows.concat(rowId);

      this.setState({expandedRows : newExpandedRows});
      
    
  }
  
  renderItem(employee) {
      const clickCallback = () => this.handleRowClick(employee.id);
      const itemRows = [
        <Employee
          employee = {employee}
          refreshState = {this.props.refreshState}
          onClick = {clickCallback}
          hasAllocations = {this.props.allocations.filter(allocation =>
          allocation.employeeId === employee.id).length > 0}
          expandedRows = {this.state.expandedRows}
        />
      ];
      
      if(this.state.expandedRows.includes(employee.id)) {
            if (this.props.allocations.filter(allocation =>
                allocation.employeeId === employee.id).length > 0
            ) {
              itemRows.push(
                  <tr key1 = {employee.id} class = "alloTable">
                      <th class = "first">Start Month</th>
                      <th class = "second">End Month</th>
                      <th class = "emThird">Project</th>
                      <th class = "third">Allocation</th>
                      <th class = "fourth">Weight</th>
                      <th class = "emFifth">Role</th>
                      <th  style = {{backgroundColor: '#ffffff00', border: 0}}></th>
                  </tr>
              )
            }
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
            return (
                <span/>
            )
      }
      )
      
      return (
        <div>
            <table rules = 'all' class = "alloTable">
                        {allItemRows}
            </table>
            <br/>
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
              <EmployeeForm 
                  refreshState = {this.props.refreshState}
                  isEditing = {this.state.isEditing} 
                  toggleEdit = {this.toggleEdit}
                  id = {this.props.employee.id}
                  name = {this.props.employee.name}
              />
              <br/>
              <br/>
          </tr>
      )
    }
    else {
      return (
          <tr key1 = {this.props.key1} class = "noBorder">
              <th colspan = "3" style = {{width: "300px"}}>
                  {this.props.employee.name} 
                  &nbsp;<button onClick = {this.toggleEdit} class = "Aes"><img src="https://cdn.pixabay.com/photo/2019/04/08/20/26/pencil-4112898_1280.png" alt = "" width="12" height="12"/></button>
                  &nbsp;<button onClick={this.deleteEmployee} class = "Aes"><img src="https://icon-library.com/images/delete-icon-png-16x16/delete-icon-png-16x16-21.jpg" alt = "" width="12" height="12"/></button>
                  &nbsp;{this.props.hasAllocations ? <button onClick={this.props.onClick} class = "Aes">{this.props.expandedRows.includes(this.props.employee.id) ? '-':'+'}</button> : <span/>}
              </th>
              <br/>
              <br/>
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
    <td class = "emForm" colspan = "2">
          <form 
              onSubmit={this.props.isEditing ? this.putEmployee : this.postEmployee} 
          >
          <input 
          class = "emForm"
          type="text"
          name = 'name'
          autoComplete = "off"
          value = {this.state.name}
          onChange = {this.changeHandler}
          required/>
          {this.props.isEditing ? <span>&nbsp;<button onClick = {this.props.toggleEdit} class = "Aes"><img src="https://www.pngfind.com/pngs/m/89-891121_confirm-icon-png-play-button-icon-png-transparent.png" alt = "" width="12" height="12"/></button></span> : <span>&nbsp;<button type = 'submit'>Add Employee</button></span>}
    </form>
    </td>
    );
  }
}



export default EmployeeCollapsable;