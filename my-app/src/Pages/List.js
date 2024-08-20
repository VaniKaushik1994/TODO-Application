import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import M from 'materialize-css';
import '../assets/css/List.css';
import { connect } from 'react-redux';
import { selectTodo } from '../store/Action';

class List extends Component{
    constructor(){
        super();
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount(){
        M.Tooltip.init(document.querySelectorAll('.tooltipped'), {});
    }

    edit(evt){
        const todo = JSON.parse(evt.target.getAttribute('data-todo'));
        todo.index = evt.target.getAttribute('data-index');
        this.props.todoToEdit(todo);
    }

    delete(evt){
        //TODO: Add Confirmations
        axios.delete('http://localhost:3001/todos/delete', {
            index: evt.target.getAttribute('data-index')
        }).then(response => {
            if(response.message){
                M.toast({html: response.data.message});
            } else {
                this.props.updatedTodos(response.data.todos.todos);
                M.toast({html: 'TODO Delete Successfully!!'});
            }
        });
    }

    
    handleEdit = (todoId) => {
        if(todoId){
            this.props.selectTodo(todoId);
        }
        // Navigate to edit page or perform other actions
    };

    render(){
        const { todos, message } = this.props.dataFromListComponent;
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {message
                            ? <tr>
                                <td colSpan="5">{message}</td>
                            </tr>
                            : todos
                                ?.map((todo, index) => 
                                    <tr key={index}>
                                        <td>{todo.title}</td>
                                        <td>{todo.description}</td>
                                        <td>{todo.status}</td>
                                        <td>{todo.priority}</td>
                                        <td>{new Date(todo.date).toLocaleDateString()}</td>
                                        <td className='actions'>
                                                <Link to={{ pathname: `/edit/${todo.id}`, state: { todo }}} >
                                                <i
                                                    className='material-icons tooltipped'
                                                    data-tooltip='Edit'
                                                    data-position='bottom'
                                                    data-todo={JSON.stringify(todo)}
                                                    data-index={index}
                                                    onClick={() => this.handleEdit(todo.id)}
                                                >
                                                    edit
                                                </i> </Link>
                                            <i
                                                className='material-icons'
                                                onClick={this.delete}
                                                data-index={index}
                                            >delete</i>
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    todos: state.todos // Assuming todos are in the state
  });
  
const mapDispatchToProps = dispatch => ({
selectTodo: todoId => dispatch(selectTodo(todoId))
});
  
export default connect(mapStateToProps, mapDispatchToProps)(List);