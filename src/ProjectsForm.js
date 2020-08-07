import * as React from "react";
import AllocationForm from "./AllocationForm";
import { AlloCollapsable }from './AlloCollapse'
import { API_ROOT } from './api-config';


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
            isShowing: ''
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
                    isShowing: false
                })
            })
            .then(result => result.json())
            .then(json => {
                if (json.length > 0) {
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
            isShowing: this.props.isShowing
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
	        
            {/* Form */}
            <form 
                onSubmit={this.props.isEditing ? this.putProject : this.postProject} 
                //style={{backgroundColor: this.props.isEditing ? '#ddd3ee' :'#d3e4ee'}}
                style = {this.formStyle}
            >
                            
            <label>Project Title: </label>
            <input 
            type="text"
            name = 'title'
            value = {this.state.title}
            onChange = {this.changeHandler}
            required 
            autoComplete="off"
            />
            
            {/* Dates */}
            <label> Start Date: </label>
            <input 
            type="date"
            name = 'startDate'
            value = {this.state.startDate}
            onChange = {this.changeHandler}
            required 
            />
            <label> End Date: </label>
            <input 
            type="date"
            name = 'endDate'
            value = {this.state.endDate}
            onChange = {this.changeHandler}
            />

            
            {/* Points */}
            <label>Total Points: </label>
            <input 
            type="number"
            name = 'totalPoints'
            value = {this.state.totalPoints}
            onChange = {this.changeHandler}
            required 
            />
            <br /><label>BA Points: </label>
            <input 
            type="number"
            name = 'baPoints'
            value = {this.state.baPoints}
            onChange = {this.changeHandler}
            required 
            />
            <label> QA Points: </label>
            <input 
            type="number"
            name = 'qaPoints'
            value = {this.state.qaPoints}
            onChange = {this.changeHandler}
            required 
            />
            <label > Dev Points: </label>
            <input 
            type="number"
            name = 'devPoints'
            value = {this.state.devPoints}
            onChange = {this.changeHandler}
            required 
            />
            
            {this.props.isEditing ? <span><button onClick = {this.props.toggleEdit}>Cancel</button><button type = 'submit'>Confirm</button></span> : <button type = 'submit'>Add Project</button>}
            </form>
            </div>

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
    }

    toggleEdit() {
        this.setState ({
            isEditing: !this.state.isEditing
        })
    }

    async deleteProject(id) {
        if(window.confirm('Are you sure')) {
            
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
	render() {
    const project = this.props;

    const tableStyle = {
    marginLeft : 'auto',
    marginRight : 'auto',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    textAlign: 'center',
    backgroundColor: '#ADD8E6'
  }

    if (this.state.isEditing) {
        return (
            <div>
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
                    isShowing = {this.props.isShowing}
                />
                <AlloCollapsable refreshState = {this.props.refreshState} projectId = {this.props.id} employees = {this.props.employees} allocations = {this.props.allocations} />
                <AllocationForm 
                    refreshState = {this.props.refreshState}
                    projectId = {project.id} 
                    employees = {project.employees} 
                    allocations = {project.allocationState}
                />
            </div>
        )
    }  else {
        return (
            <div>
                <table style = {tableStyle} rules = 'all'>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Total Points</th>
                            <th>BA Points</th>
                            <th>QA Points</th>
                            <th>Dev Points</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{project.title}</td>
                            <td>{this.props.monthNames[new Date(project.startDate).getMonth()]} {project.startDate.substring(8, 10)}, {project.startDate.substring(0, 4)} </td>
                            <td>{project.endDate === null ? <span/> : <span>{this.props.monthNames[new Date(project.endDate).getMonth()]} {project.endDate.substring(8, 10)}, {project.endDate.substring(0, 4)}</span>}</td>
                            <td>{project.totalPoints}</td>
                            <td>{project.baPoints}</td>
                            <td>{project.qaPoints}</td>
                            <td>{project.devPoints}</td>
                            <td>
                                <button onClick = {this.toggleEdit}>Update</button>
                                <button onClick={this.deleteProject}><img src="https://icon-library.com/images/delete-icon-png-16x16/delete-icon-png-16x16-21.jpg" alt='This better work' width="12" height="12"/></button>
                             </td>
                        </tr>
                    </tbody>
                </table>
                {/* <div style = {{backgroundColor : '#ddd3ee'}}>Project: {project.title}
                 Start Date: {this.props.monthNames[new Date(project.startDate).getMonth()]} {project.startDate.substring(8, 10)}, {project.startDate.substring(0, 4)} {project.endDate === null ? <span/> : <span>End Date: {this.props.monthNames[new Date(project.endDate).getMonth()]} {project.endDate.substring(8, 10)}, {project.endDate.substring(0, 4)}</span>} Total Points: {project.totalPoints} BA Points: {project.baPoints} QA Points: {project.qaPoints} Dev Points: {project.devPoints}
                <button onClick = {this.toggleEdit}>Update</button>
                <button onClick={this.deleteProject}><img src="https://icon-library.com/images/delete-icon-png-16x16/delete-icon-png-16x16-21.jpg" alt='This better work' width="12" height="12"/></button>
                </div> */}
                <br/>
                <AlloCollapsable key = {this.props.id} refreshState = {this.props.refreshState} projectId = {this.props.id} employees = {this.props.employees} allocations = {this.props.allocations} addAllocation = {this.props.addAllocation}/>
                <AllocationForm
                    refreshState = {this.props.refreshState} 
                    projectId = {project.id} 
                    employees = {project.employees} 
                    allocations = {project.allocationState} 
                    isEditing = {false}
                />
            </div>
        );
    }

  	
  }
}
export { ProjectForm, Project, };