import React from "react";

export class PrioritySelect extends React.Component{
    render(){
        return(
            <div className="row">
                <div className="input-field col s12" id="todo_priority">
                    <select
                        name="priority"
                        onChange={this.props.formChange}
                        id="priority_to_do"
                        value={ this.props.priority }
                    >
                        <option value="" disabled>Choose your option</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <label>Priority</label>
                </div>
            </div>
        )
    }
}