import React from "react";
import axios from "axios";
import M from "materialize-css";
import '../assets/css/Card.css';
import ListComponent from '../Pages/ListShadow';
import  Button  from "./Button";
import { TodoModal } from "../modals/Todo";

export class Card extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false, // Set initial state to open
            formName: '',
            mounted: true,
            todo: '',
            todos: [],
            message: ''
        };
        this.addClicked = this.addClicked.bind(this);
        this.todoToEdit = this.todoToEdit.bind(this);
        this.todosUpdate = this.todosUpdate.bind(this);
        this.listTodos = this.listTodos.bind(this);
    }

    todosUpdate(data){
        this.setState({todos: data});
    }

    todoToEdit(data){
        this.setState({formName: 'Edit TODO', todo: data});
    }

    componentDidMount(){
        this.setState({ mounted: true});
        this.listTodos();
    }
    
    handleClose = () => {;
        this.setState({ isOpen: false });
    };

    addClicked(){
        this.setState({  formName: 'add-to-do' });
    }
    
    listTodos(){
        axios.get('http://localhost:3001/todos')
            .then(response => {
                response = JSON.parse(response.data);
                console.log(response);
                if(response.message){
                    this.setState({message: response.message});
                } else {
                    this.setState({todos: response.todos});
                }
            })
            .catch(() => {
                M.toast({html: 'Something went wrong!!'});
            });
    }

    render(){
        return(
            <div>
                <div className="card">
                    <div className="card-content">
                        <Button
                            onClick={this.addClicked}
                            buttonLabel="Add TODO"
                            className="waves-effect waves-light btn right modal-trigger"
                            dataTarget="add_modal"
                            id="add_to_do"
                        />
                        <ListComponent
                            todoToEdit={this.todoToEdit}
                            todos={this.state.todos}
                            message={this.state.message}
                            updatedTodos={ this.todosUpdate }
                        />
                    </div>
                </div>
                <TodoModal
                    formName={this.state.formName}
                    todo={this.state.todo}
                    addEvent={this.todosUpdate}
                    modalId={ (this.state.formName === 'Edit TODO')
                        ? `edit_modal_${ this.state.todo.index }`
                        : 'add_modal'
                    }/>
            </div>
        )
    }
}