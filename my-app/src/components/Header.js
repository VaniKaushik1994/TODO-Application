import React from 'react';
import '../assets/css/Header.css';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

class Header extends React.Component{
    constructor(){
        super()
        this.state = {
            id: null
        }
    }
    componentDidUpdate(){
        console.log(this.props.selectedTodo.selectedTodoId)
        if(this.state.id !== this.props.selectedTodo.selectedTodoId){
            this.setState({
                id: this.props.selectedTodo.selectedTodoId
            })
        }
    }
    render(){
        return (
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper row">
                        <div class="col s4">
                            {this.state.id
                            ? <Link to={{ pathname: `/`}} >
                                    <i className="material-icons left" id="back_btn">home</i>
                                </Link>
                            : ''}
                        </div>
                        <div class=" col s6">
                            <span className="brand-logo center">
                                To Do Application
                            </span>
                        </div>
                        <div class="float-right">
                            <i className="material-icons right" id="profile-btn">account_circle</i>
                        </div>
                    </div>
                </nav>
          </div>
        );
    }
}
const WrappedHeader = withRouter(Header);
export { Header, WrappedHeader }; // Export the wrapped component for internal use if needed