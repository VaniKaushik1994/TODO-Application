import React from "react";

export class History extends React.Component{
    render(){
        return(
        <div className="history">
            <div className="history-body">
                <div className="user-info">
                    <i className="material-icons" alt="User Avatar">account_circle</i>
                    <span className="history-text">{this.props.history.description}</span>
                </div>
            </div>
            <div className="history-footer">
                <span className="updated-date">{new Date(this.props.history.date).toLocaleString()}</span>
            </div>
        </div>
        )
    }
}