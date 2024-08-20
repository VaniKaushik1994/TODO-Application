import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Header.css';
import { withRouter } from 'react-router-dom';

class Header extends React.Component{
    render(){
        return (
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper">
                        
                        <i className="materials-icon">home</i>
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

const WrappedHeader = withRouter(Header);
export default WrappedHeader;
export { Header }; // Export the wrapped component for internal use if needed