import React from 'react';
import M from 'materialize-css';
import axios from 'axios';
import '../assets/css/List.css';
import { withRouter } from "react-router-dom";
import { StatusSelect } from '../components/StatusSelect';
import { PrioritySelect } from '../components/PrioritySelect';
import { Tabs } from '../components/Tabs';

class Edit extends React.Component{
    constructor(){
        super();
        this.state = {
            todo: '',
            comments: [],
            original: '',
            titleEditable: false,
            descriptionEditable: false,
            title: '',
            histories: [],
        };
        this.formChange = this.formChange.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.addComments = this.addComments.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        this.makeTitleEditable = this.makeTitleEditable.bind(this);
        this.makeNonEditable = this.makeNonEditable.bind(this);
        this.changeCurrentTitle = this.changeCurrentTitle.bind(this);
    }

    componentDidMount(){
        M.FormSelect.init(document.querySelectorAll('select'), {});
        M.updateTextFields();
        M.Tabs.init(document.querySelectorAll('.tabs'), {});
       this.getTodoDetails();
    }

    componentDidUpdate(){
        M.updateTextFields();
        M.FormSelect.init(document.querySelectorAll('select'), {});
        M.Tabs.init(document.querySelectorAll('.tabs'), {});
    }

    getTodoDetails(){
        axios.get(`http://localhost:3001/todos/${ this.props.location.state.todo.id }`)
            .then((response) => {
                this.setState({
                    todo: response.data.todo,
                    comments: response.data.comments,
                    histories: response.data.histories
                })
            });
    }

    updateDescription(evt){
        const todo = {
            ...this.state.todo,
            description: evt.target.value,
        }
        this.setState({ todo });
    }

    resetDescription(){
        this.setState({ todo: {...this.state.todo, description: this.state.original}});
    }

    updateTodo(action){
        const todo = this.state.todo;
        axios.put('http://localhost:3001/todos/edit', {
            todo,
            action: typeof action === 'object' ? 'description' : action
        }, () => {});
    }

    formChange(evt){
        this.setState({ todo: {
            ...this.props.location.state.todo, 
            [evt.target.name]: evt.target.value,
        }}, () => {
            const action = evt.target.name;
            this.updateTodo(action);
        })
    }

    addComments(value){
        axios.post('http://localhost:3001/todos/comments/add', {
            comment: value,
            id: this.props.location.state.todo.id
        }).then(response => {
            response = response.data;
            if(response.message){
                M.toast({html: response.message});
            } else {
                this.setState({comments: response.comments.comments});
                M.toast({ html: 'Comment Added Successfully!!'});
            }
        }).catch(err => {
            M.toast({html: 'Something went wrong!!'})
        });
    }

    updateComment(value){
        axios.put(`http://localhost:3001/todos/comments/${value.id}`, {
            comment: value,
            id: this.props.location.state.todo.id
        }).then(response => {
            response = response.data;
            if(response.message){
                M.toast({html: response.message});
            } else {
                this.setState({comments: response.comments.comments});
                M.toast({ html: 'Comment Edited Successfully!!'});
            }
        }).catch(err => {
            M.toast({html: 'Something went wrong!!'})
        });
    }

    deleteComment({id}){
        axios.delete(`http://localhost:3001/todos/comments/${this.props.location.state.todo.id}/${ id }`, {
            comment_id: id,
            id: this.props.location.state.todo.id
        }).then(response => {
            response = response.data;
            if(response.message){
                M.toast({html: response.message});
            } else {
                this.setState({comments: response.comments.comments});
                M.toast({ html: 'Comment Deleted Successfully!!'});
            }
        }).catch(err => {
            M.toast({html: 'Something went wrong!!'})
        });
    }

    makeTitleEditable(){
        this.setState({titleEditable: true, title: this.state.todo.title});
    }

    makeNonEditable(){
        this.setState({
            titleEditable: false,
            todo: {
                ...this.state.todo,
                title: this.state.title
            }
        }, () => {
            this.updateTodo('title');
        })
    }

    changeCurrentTitle(evt){
        this.setState({
            title: evt.target.value,
        })
    }

    render(){
        const todo = this.state.todo;
        return (
            <div className="card">
                <div className="card-content">
                    <div className="row">
                        <div className="col s9">
                            { this.state.titleEditable
                                ? <input
                                    onBlur={this.makeNonEditable}
                                    value={this.state.title}
                                    onChange={this.changeCurrentTitle}
                                    />
                                : <h5 onClick={this.makeTitleEditable}>{todo.title}</h5>
                            }
                            <div className="row">
                                <div className="input-field col s12">
                                <textarea
                                    name="description"
                                    onChange={this.updateDescription}
                                    id="todo_decription"
                                    className="materialize-textarea"
                                    value={todo.description} />
                                <label htmlFor="todo_decription">Description*</label>
                                </div>
                                <div className="btn_section right">
                                <i className="material-icons" onClick={this.updateTodo}>check</i>
                                <i className="material-icons"onClick={this.resetDescription}>close</i>
                            </div>
                            </div>
                            <div className='row'>
                                <Tabs
                                    id={todo.id}
                                    addAComment={this.addComments}
                                    comments={this.state.comments}
                                    histories={this.state.histories}
                                    updateAComment={this.updateComment}
                                    deleteAComment={this.deleteComment}
                                />
                            </div>
                        </div>
                        <div className="col s3">
                            <StatusSelect
                                isEdit={true}
                                formChange={ this.formChange }
                                status={todo.status} />
                            <PrioritySelect
                                formChange={ this.formChange }
                                priority={todo.priority} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Edit);