import React from "react";

export class PrioritySelect extends React.Component{
    componentDidMount() {
        // If you're using Materialize CSS, initialize the select
        if (window.M && window.M.FormSelect) {
            window.M.FormSelect.init(document.querySelectorAll('select'));
        }
    }
    
    render(){
        return(
            <div className="row">
                <div className="input-field col s12" id="todo_priority">
                    <select
                        name="priority"
                        onChange={this.props.formChange}
                        id="priority_to_do"
                        value={ this.props.isEdit ? this.props.priority : 'Medium' }
                    >
                        <option value="" disabled>Choose your option</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <label htmlFor="priority_to_do">Priority</label>
                </div>
            </div>
        )
    }
}