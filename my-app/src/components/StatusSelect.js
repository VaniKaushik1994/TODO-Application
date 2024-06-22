import React from 'react';;

export class StatusSelect extends React.Component{
    render(){
        return(
            <div style={this.props.isEdit ? {} : {display:'none'}} className="row">
                <div className="input-field col s12" id="todo_status">
                    <select
                        onChange={this.props.formChange}
                        disabled={!this.props.isEdit}
                        name="status"
                        id="status_to_do"
                        value={ this.props.status }
                    >
                        <option value="" disabled>Choose your option</option>
                        <option value="New">New</option>
                        <option value="In progress">In progress</option>
                        <option value="Defered">Defered</option>
                        <option value="Done">Done</option>
                    </select>
                    <label>Status</label>
                </div>
            </div>
        )
    }
}