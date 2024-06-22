import React from "react";
import '../assets/css/Button.css';

export default class Button extends React.Component{

    render(){
        const { className, onClick, dataTarget, buttonLabel, id } = this.props; 
        return (
            <button
                onClick={ onClick }
                className={className}
                id={id}
                data-target={dataTarget}>
                { buttonLabel }
            </button>
        )
    }
}