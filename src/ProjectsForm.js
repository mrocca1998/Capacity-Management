import * as React from "react";
import AllocationForm from "./AllocationForm";
import { AlloCollapsable }from './AlloCollapse'
import { API_ROOT } from './api-config';
import './index.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import BreakdownChart from './BreakdownChart';


class ProjectForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            title : '',
            startDate : '',
            endDate : '',
            totalPoints: '',
            baPoints : '',
            qaPoints : '',
            devPoints : '',
            isUpdate: ''
        }
        this.formStyle = {
            marginLeft : 'auto',
            marginRight : 'auto',
        }
        this.postProject = this.postProject.bind(this);
        this.putProject = this.putProject.bind(this);
        this.fillState = this.fillState.bind(this);
    }

    changeHandler = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }
    
    async postProject(event) {
        event.preventDefault();
        try {
            fetch(API_ROOT + 'projects', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type':'application/json',
                },
                body: JSON.stringify({
                    title : this.state.title,
                    startDate : this.state.startDate,
                    endDate : this.state.endDate,
                    totalPoints: this.state.totalPoints,
                    baPoints : this.state.baPoints,
                    qaPoints : this.state.qaPoints,
                    devPoints : this.state.devPoints,
                    isUpdate: this.props.isUpdate
                })
            })
            .then(result => result.json())
            .then(json => {
                if (json.length > 0 && isNaN(json)) {
                    alert(json);
                }  
                this.props.refreshState();     
            })
            //console.log('Result ' + result)
        } catch (e) {
            console.log(e)
        }
        
    }

    async putProject(event) {
        event.preventDefault();
        try {
            await fetch(API_ROOT + 'Projects/' + this.props.projectId, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-type':'application/json',
                },
                body: JSON.stringify(this.state)
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
        var startDate = JSON.stringify(new Date(this.props.startDate)).slice(1,11);
        var endDate = null;
        if (this.props.endDate != null) {
            endDate = JSON.stringify(new Date(this.props.endDate)).slice(1,11);
        }
        this.setState({
            id: this.props.projectId,
            title : this.props.title,
            startDate : startDate,
            endDate : endDate,
            totalPoints: this.props.totalPoints,
            baPoints : this.props.baPoints,
            qaPoints : this.props.qaPoints,
            devPoints : this.props.devPoints,
            isUpdate: this.props.isUpdate
            
        })
    }

    componentDidMount() {
        if (this.props.isEditing) {
            this.fillState();
        }
    };



    render() {

        return (
            <td colSpan = "8" style = {{alignContent: 'left'}}>
            {/* Form */}
            <form 
                onSubmit={this.props.isEditing ? this.putProject : this.postProject} 
                style = {this.formStyle}
            >
            <input
            style = {{width: '100px', textAlign: "center"}}
            type="text"
            name = 'title'
            value = {this.state.title}
            onChange = {this.changeHandler}
            required 
            autoComplete="off"
            />
            {/* Dates */}
            <input 
            style = {{height: '17px', font: "95% Arial, Helvetica, sans-serif", textAlign: "center"}}
            type="date"
            
            name = 'startDate'
            value = {this.state.startDate}
            onChange = {this.changeHandler}
            required 
            />
            <input
            style = {{height: '17px', font: "95% Arial, Helvetica, sans-serif", textAlign: "center"}}
            type="date"
            name = 'endDate'
            value = {this.state.endDate}
            onChange = {this.changeHandler}
            />

            
            {/* Points */}
            <input 
            style = {{width: '85px', textAlign: "center"}}
            type="number"
            name = 'totalPoints'
            value = {this.state.totalPoints}
            onChange = {this.changeHandler}
            required 
            />
            
            <input 
            style = {{width: '85px', textAlign: "center"}}
            type="number"
            name = 'baPoints'
            value = {this.state.baPoints}
            onChange = {this.changeHandler}
            required 
            />
            <input 
            style = {{width: '85px', textAlign: "center"}}
            type="number"
            name = 'qaPoints'
            value = {this.state.qaPoints}
            onChange = {this.changeHandler}
            required 
            />
            <input 
            style = {{width: '85px', textAlign: "center"}}
            type="number"
            name = 'devPoints'
            value = {this.state.devPoints}
            onChange = {this.changeHandler}
            required 
            />
            
            {this.props.isEditing ? <span ><button onClick = {this.props.toggleEdit} style = {{width: '34px'}} class = "Aes"><img src="https://image.flaticon.com/icons/svg/66/66847.svg" alt = "" width="12" height="12"/></button><button type = 'submit' class = "Aes"><img src="https://www.pngfind.com/pngs/m/89-891121_confirm-icon-png-play-button-icon-png-transparent.png" alt = "" width="12" height="12"/></button>&nbsp;&nbsp;</span> : <button type = 'submit'>Add Project</button>}
            </form>
            </td>

        );
    }
}


class Project extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isEditing: false
        }
        this.deleteProject = this.deleteProject.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.toggleShowing = this.toggleShowing.bind(this);
        this.postProjectCopy = this.postProjectCopy.bind(this);
    }

    toggleEdit() {
        this.setState ({
            isEditing: !this.state.isEditing
        })
    }

    async deleteProject(id) {
        if(window.confirm('Are you sure you want to delete the project ' + this.props.title + '?\nDoing so will also delete all allocations attributed to the project.')) {
            
            try { 
                const result = await fetch(API_ROOT + 'projects/' + this.props.id, {
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

    toggleShowing() {
        try {
            const result = fetch(API_ROOT + 'projects/' + this.props.id, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-type':'application/json',
                },
                body: JSON.stringify({
                    id: this.props.id,
                    isShowing: !this.props.isShowing
               })
            });

            console.log('Result ' + result)
        } catch (e) {
            console.log(e)
        }
        this.props.refreshState();
    }

    async postProjectCopy() {
        const project = this.props;
        try {
            fetch(API_ROOT + 'projects', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type':'application/json',
                },
                body: JSON.stringify({
                    title : project.title + ' Update',
                    startDate : project.startDate,
                    endDate : project.endDate,
                    totalPoints: project.totalPoints,
                    baPoints : project.baPoints,
                    qaPoints : project.qaPoints,
                    devPoints : project.devPoints,
                    isUpdate: 1
                })
            })
            .then(result => result.json())
            .then(json => {
              if (json.length > 0 && isNaN(json)) {
                alert(json);
              }  
              else if (!isNaN(json)) {
                const copyId = json;
                this.props.allAllocations.filter(allocation => allocation.projectId === project.id).map(allocation => this.postCopyAllocation(allocation, copyId))
              }   
              this.props.refreshState();  
            })
        } catch (e) {
            console.log(e)
        }
      }
      
      postCopyAllocation(allocation, copyId) {
        try {
            fetch(API_ROOT + 'allocations', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type':'application/json',
                },
                body: JSON.stringify({
                    projectId: copyId,
                    employeeId: allocation.employeeId,
                    role: allocation.role,
                    startDate: allocation.startDate,
                    endDate: allocation.endDate,
                    allocation1: allocation.allocation1,
                    workWeight: allocation.workWeight,
                    isUpdate: 1
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
      }
      

	render() {
    const project = this.props;

    if (this.state.isEditing) {
        return (
            <div>
                <table class = "legendTable" rules = 'all'>
                    <tr class = "legendTable">
                        <th width = "100px">Project</th>
                        <th width = "145px">Start Date</th>
                        <th width = "145px">End Date</th>
                        <th width = "88px">Total Points</th>
                        <th width = "92px">BA Points</th>
                        <th width = "90px">QA Points</th>
                        <th width = "90px">Dev Points</th>
                        <th width = '65px'></th>
                    </tr>
                    <tr class = "legendTable" colspan = "8" style = {{justifyContent:'left'}}>
                        <ProjectForm
                            refreshState = {this.props.refreshState}
                            isEditing = {this.state.isEditing} 
                            toggleEdit = {this.toggleEdit}
                            projectId = {this.props.id}
                            title = {this.props.title}
                            startDate = {this.props.startDate}
                            endDate = {this.props.endDate}
                            totalPoints = {this.props.totalPoints}
                            baPoints = {this.props.baPoints}
                            qaPoints = {this.props.qaPoints}
                            devPoints = {this.props.devPoints}
                            isUpdate = {this.props.isUpdate}
                        />
                    </tr>
                </table>
                <br/>
                <div class = "sticky">
                <BreakdownChart height = {180} chartSettings = {[
                    { type: 'string', label: 'Task ID' },
                    { type: 'string', label: 'Task Name' },
                    { type: 'string', label: 'Resource' },
                    { type: 'date', label: 'Start Date' },
                    { type: 'date', label: 'End Date' },
                    { type: 'number', label: 'Duration' },
                    { type: 'number', label: 'Percent Complete' },
                    { type: 'string', label: 'Dependencies' },
                    ]} 
                    baEndDate = {this.props.baEndDate}
                    qaEndDate = {this.props.qaEndDate}
                    devEndDate = {this.props.devEndDate}
                    startDate = {this.props.startDate}
                    endDate = {this.props.endDate}
                    calcEndDate = {this.props.calcEndDate}
                    title = {this.props.title}
                />
                </div>
                <br/>
                <br/>
                <table class = "legendTable" rules = 'all'>
                    <tr class = "legendTable">
                        <th width = "95px">Employee</th>
                        <th width = "46px">Role</th>
                        <th width = "150px">Start Month</th>
                        <th width = "155px">End Month</th>
                        <th width = "85px">Allocation</th>
                        <th width = "60px">Weight</th>
                        <th width = '101px'></th>
                    </tr>
                    <tr class = "legendTable" >
                        <AllocationForm
                            refreshState = {this.props.refreshState} 
                            projectId = {project.id} 
                            employees = {project.employees} 
                            allocations = {project.allocationState} 
                            isEditing = {false}
                            isUpdate= {this.props.isUpdate}
                        />
                    </tr>
                </table>
                <br/>
                <br/>
                <div class = "disciplineTabs">
                <Tabs>
                    <TabList>
                        <Tab>BA</Tab>
                        <Tab>QA</Tab>
                        <Tab>Dev</Tab>
                    </TabList>
                    <TabPanel>
                        <AlloCollapsable 
                            key = {this.props.id} 
                            refreshState = {this.props.refreshState} 
                            projectId = {this.props.id} employees = {this.props.employees} 
                            allocations = {this.props.allocations} 
                            addAllocation = {this.props.addAllocation}
                            expandProjectRow = {this.props.expandProjectRow}
                            collapseProjectRow = {this.props.collapseProjectRow}
                            projectRows = {this.props.projectRows}
                            projectName = {this.props.title}
                            role = {'BA'}
                            isUpdate = {this.props.isUpdate}
                        />
                    </TabPanel>
                    <TabPanel>
                        <AlloCollapsable 
                            key = {this.props.id} 
                            refreshState = {this.props.refreshState} 
                            projectId = {this.props.id} employees = {this.props.employees} 
                            allocations = {this.props.allocations} 
                            addAllocation = {this.props.addAllocation}
                            expandProjectRow = {this.props.expandProjectRow}
                            collapseProjectRow = {this.props.collapseProjectRow}
                            projectRows = {this.props.projectRows}
                            projectName = {this.props.title}
                            role = {'QA'}
                            isUpdate = {this.props.isUpdate}
                        />
                    </TabPanel>
                    <TabPanel>
                        <AlloCollapsable 
                            key = {this.props.id} 
                            refreshState = {this.props.refreshState} 
                            projectId = {this.props.id} employees = {this.props.employees} 
                            allocations = {this.props.allocations} 
                            addAllocation = {this.props.addAllocation}
                            expandProjectRow = {this.props.expandProjectRow}
                            collapseProjectRow = {this.props.collapseProjectRow}
                            projectRows = {this.props.projectRows}
                            projectName = {this.props.title}
                            role = {'Dev'}
                            isUpdate = {this.props.isUpdate}
                        />
                    </TabPanel>
                </Tabs>
                <br/>
                <br/>
                {!this.props.isUpdate ? <div class = "updateButton"><button onClick = {this.postProjectCopy}>Send to Update Mode</button></div> : <div/>}
                </div>

            </div>
        )
    }  else {
        return (
            <div>
                <table class = "legendTable" rules = 'all'>
                        <tr class = "legendTable">
                            <th width = "100px">Project</th>
                            <th width = "145px">Start Date</th>
                            <th width = "145px">End Date</th>
                            <th width = "88px">Total Points</th>
                            <th width = "92px">BA Points</th>
                            <th width = "90px">QA Points</th>
                            <th width = "90px">Dev Points</th>
                            <th width = '65px'></th>
                        </tr>
                        <tr class = "legendTable" height = '24px'>
                            <td>{project.title}</td>
                            <td>{this.props.monthNames[new Date(project.startDate).getMonth()]} {project.startDate.substring(8, 10)}, {project.startDate.substring(0, 4)} </td>
                            <td>{project.endDate === null ? <span/> : <span>{this.props.monthNames[new Date(project.endDate).getMonth()]} {project.endDate.substring(8, 10)}, {project.endDate.substring(0, 4)}</span>}</td>
                            <td>{project.totalPoints}</td>
                            <td>{project.baPoints}</td>
                            <td>{project.qaPoints}</td>
                            <td>{project.devPoints}</td>
                            <td>
                                <span>
                                <button onClick = {this.toggleEdit} class = "Aes"><img src="https://cdn.pixabay.com/photo/2019/04/08/20/26/pencil-4112898_1280.png" alt = "" width="12" height="12"/></button>
                                &nbsp;<button onClick={this.deleteProject} class = "Aes"><img src="https://icon-library.com/images/delete-icon-png-16x16/delete-icon-png-16x16-21.jpg" alt='This better work' width="12" height="12"/></button>
                                </span>
                             </td>
                        </tr>
                </table>
                <br/>
                <div class = "sticky">
                <BreakdownChart height = {180} chartSettings = {[
                    { type: 'string', label: 'Task ID' },
                    { type: 'string', label: 'Task Name' },
                    { type: 'string', label: 'Resource' },
                    { type: 'date', label: 'Start Date' },
                    { type: 'date', label: 'End Date' },
                    { type: 'number', label: 'Duration' },
                    { type: 'number', label: 'Percent Complete' },
                    { type: 'string', label: 'Dependencies' },
                    ]} 
                    baEndDate = {this.props.baEndDate}
                    qaEndDate = {this.props.qaEndDate}
                    devEndDate = {this.props.devEndDate}
                    startDate = {this.props.startDate}
                    endDate = {this.props.endDate}
                    calcEndDate = {this.props.calcEndDate}
                    title = {this.props.title}
                />
                </div>
                <br/>
                <br/>
                <table class = "legendTable" rules = 'all'>
                    <tr class = "legendTable">
                        <th width = "95px">Employee</th>
                        <th width = "46px">Role</th>
                        <th width = "150px">Start Month</th>
                        <th width = "155px">End Month</th>
                        <th width = "85px">Allocation</th>
                        <th width = "60px">Weight</th>
                        <th width = '101px'></th>
                    </tr>
                    <tr class = "legendTable" style = {{justifyContent: 'left'}}>
                        <AllocationForm
                            refreshState = {this.props.refreshState} 
                            projectId = {project.id} 
                            employees = {project.employees} 
                            allocations = {project.allocationState} 
                            isUpdate = {this.props.isUpdate}
                        />
                    </tr>
                </table>
                <br/>
                <br/>
                <div class = "disciplineTabs">
                <Tabs>
                    <TabList>
                        <Tab>BA</Tab>
                        <Tab>QA</Tab>
                        <Tab>Dev</Tab>
                    </TabList>
                    <TabPanel>
                        <AlloCollapsable 
                            key = {this.props.id} 
                            refreshState = {this.props.refreshState} 
                            projectId = {this.props.id} employees = {this.props.employees} 
                            allocations = {this.props.allocations} 
                            addAllocation = {this.props.addAllocation}
                            expandProjectRow = {this.props.expandProjectRow}
                            collapseProjectRow = {this.props.collapseProjectRow}
                            projectRows = {this.props.projectRows}
                            projectName = {this.props.title}
                            role = {'BA'}
                            isUpdate = {this.props.isUpdate}
                        />
                    </TabPanel>
                    <TabPanel>
                        <AlloCollapsable 
                            key = {this.props.id} 
                            refreshState = {this.props.refreshState} 
                            projectId = {this.props.id} employees = {this.props.employees} 
                            allocations = {this.props.allocations} 
                            addAllocation = {this.props.addAllocation}
                            expandProjectRow = {this.props.expandProjectRow}
                            collapseProjectRow = {this.props.collapseProjectRow}
                            projectRows = {this.props.projectRows}
                            projectName = {this.props.title}
                            role = {'QA'}
                            isUpdate = {this.props.isUpdate}
                        />
                    </TabPanel>
                    <TabPanel>
                        <AlloCollapsable 
                            key = {this.props.id} 
                            refreshState = {this.props.refreshState} 
                            projectId = {this.props.id} employees = {this.props.employees} 
                            allocations = {this.props.allocations} 
                            addAllocation = {this.props.addAllocation}
                            expandProjectRow = {this.props.expandProjectRow}
                            collapseProjectRow = {this.props.collapseProjectRow}
                            projectRows = {this.props.projectRows}
                            projectName = {this.props.title}
                            role = {'Dev'}
                            isUpdate = {this.props.isUpdate}
                        />
                    </TabPanel>
                <br/>
                <br/>
                </Tabs>
                {!this.props.isUpdate ? <div class = "updateButton"><button onClick = {this.postProjectCopy}>Send to Update Mode</button></div> : <div/>}
                </div>

            </div>
        );
    }

  	
  }
}
export { ProjectForm, Project, };