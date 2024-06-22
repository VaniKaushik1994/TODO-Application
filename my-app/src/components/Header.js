import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Header.css';

export class Header extends React.Component{
    render(){
        return (
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper">
                        <span className="brand-logo">
                            <Link to={{ pathname: `/`}} >
                                <i className="material-icons left" id="back_btn">arrow_back</i>
                            </Link>
                            To Do Application
                        </span>
                    </div>
                </nav>
          </div>
        );
    }
}