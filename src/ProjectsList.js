import * as React from "react";
import AllocationList from "./AllocationList";
import axios from 'axios';
class ProjectsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title : '',
            startDate : '',
            endDate : '',
            totalPoints: '',
            baPoints : '',
            qaPoints : '',
            devPoints : ''
        }
        this.postProject = this.postProject.bind(this);
    }

    changeHandler = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }
    
    async postProject(event) {
        event.preventDefault();
        try {
            const result = await fetch('https://localhost:44391/api/projects', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type':'application/json',
                },
                body: JSON.stringify(this.state)
            });

            console.log('Result ' + result)
        } catch (e) {
            console.log(e)
        }
        this.props.refreshState();
    }
    render() {

        return (
            <div>
  	        {this.props.projects.map(project => <Project refreshState = {this.props.refreshState} employees = {this.props.employees} allocationState = {this.props.allocations} addEmployee = {this.props.addEmployee} addAllocation = {this.props.addAllocation} {...project}/>)}
	        
            {/* Form */}
            <form onSubmit={this.postProject} style={{
            backgroundColor: '#d3e4ee',
            }}>
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
            <label > Developer Points: </label>
            <input 
            type="number"
            name = 'devPoints'
            value = {this.state.devPoints}
            onChange = {this.changeHandler}
            required 
            />
            <button type = 'submit'>Add Project</button>
            </form>
            </div>

        );
    }
}


class Project extends React.Component {
    constructor(props) {
        super(props)
        this.deleteProject = this.deleteProject.bind(this);
    }

    async deleteProject(id) {
        if(window.confirm('Are you sure')) {
            
            try { 
                const result = await fetch('https://localhost:44391/api/projects/' + this.props.id, {
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
      const project = this.props;
  	return (
    	<div>
            <div style = {{backgroundColor : '#ddd3ee'}}>{project.title} Start Date: {project.startDate} End Date: {project.endDate} Total Points: {project.totalPoints} BA Points: {project.baPoints} QA Points: {project.qaPoints} Dev Points: {project.devPoints}
            <button onClick={this.deleteProject}>Delete Project</button>
            </div>
            <AllocationList  refreshState = {this.props.refreshState} projectId = {project.id} employees = {project.employees} allocations = {project.allocationState} addAllocation = {project.addAllocation}/>
        </div>
    );
  }
}

export default ProjectsList;