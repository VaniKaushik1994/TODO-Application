import React from 'react';
import M from 'materialize-css';
import axios from 'axios';
import { StatusSelect } from '../components/StatusSelect';
import { PrioritySelect } from '../components/PrioritySelect';
import ReactQuill  from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../assets/css/Quill.css';

export class TodoModal extends React.Component{
    constructor(props){
        super(props);
        this.newCommentOnState = this.newCommentOnState.bind(this);
        this.state = {
            currentTodo: {},
            disabled: true,
            modalId: '',
            title: '',
            description: '',
            priority: 'Low',
            status: (props.title === 'Add ToDo') ? 'New' : '',
            todoDate: new Date().toLocaleDateString(),
            modules: {
                toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline','strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image'],
                ['clean']
                ],
            },
            formats: [
                'header',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image'
            ],
        };
        this.handleFormData = this.handleFormData.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.formChange = this.formChange.bind(this);
        this.addTodo = this.addTodo.bind(this);
        this.modalRef = React.createRef();
        this.editTodo = this.editTodo.bind(this);
        this.quillRef = React.createRef();; // Quill instance
        this.reactQuillRef = React.createRef();; // ReactQuill component
    }

    newCommentOnState(){
        if(this.reactQuillRef && this.reactQuillRef.current){
            this.setState({comment: this.reactQuillRef.current.value});
        }
    }

    componentDidMount(){
        M.Modal.init(this.modalRef.current);
        // M.FormSelect.init(document.querySelectorAll('select'), {});
        M.updateTextFields();
        this.attachQuillRefs();
    }

    componentDidUpdate(prevProps){
        M.Modal.init(this.modal);
        M.updateTextFields();
        // M.FormSelect.init(document.querySelectorAll('select'), {});
        if(prevProps.modalId !== this.props.modalId || this.props.modalId.includes('edit')){
            const modalInstance = M.Modal.getInstance(this.modalRef.current);
            modalInstance?.open();
        }
        if(this.props.todo && prevProps.todo !== this.props.todo){
            this.setState({title: this.props.todo.title, description: this.props.todo.description,
                priority: this.props.todo.priority, status: this.props.todo.status, date: this.props.date})
        }
        this.attachQuillRefs();
    }

    componentWillUnmount() {
        const quill = this.quillRef.current?.quill; // Check for existence before cleanup
        if (quill) {
          quill.destroy(); // Clean up Quill instance
        }
      }

    attachQuillRefs = () => {
        if (typeof this.reactQuillRef?.getEditor !== 'function') return;
            this.quillRef = this.reactQuillRef?.getEditor();
    }

    handleFormData(data){
        data.date = this.state.date || new Date();
        this.setState({currentTodo: data}, () => {
            const {title, description, priority, status} = this.state.currentTodo;
            if(title && description && priority && status){
                this.setState({disabled: false});
            }
        });
    }

    addTodo(){
        axios.post('http://localhost:3001/todos/add', {todo: this.state.currentTodo})
            .then(response => {
                response = response.data;
                if(response.message){
                    this.setState({message: response.message});
                    M.toast({html: response.message});
                } else {
                    this.setState({todos: response.todos.todos, currentTodo: {}});
                    this.props.addEvent(response.todos.todos);
                    this.setState({title: '', description: '', status: 'New', priority: 'Low', todoDate: ''});
                    M.toast({ html: 'TODO Added Successfully!!'});
                }
            })
            .catch(err => {
                M.toast({html: 'Something went wrong!!'});
            });
    }

    editTodo(){
        axios.put('http://localhost:3001/todos/edit', {
            todo: this.state.currentTodo,
            index: this.props.modalId.split('edit_modal_')[1]
        }).then(response => {
            response = response.data;
            if(response.message){
                this.setState({message: response.message});
                M.toast({html: response.message});
            } else {
                this.setState({todos: response.todos.todos});
                this.props.addEvent(response.todos.todos);
                M.toast({ html: 'TODO Updated Successfully!!'})
            }
        }).catch(err => {
            M.toast({html: 'Something went wrong!!'})
        });
    }

    submitForm(){
        const {title, description} = this.state;
        if(title && description){
            this.handleFormData({
                title,
                description,
                priority: (this.props.formName === 'add-to-do') ? 'Low': this.state.priority,
                status: (this.props.formName === 'add-to-do') ? 'New' : this.state.status,
                date:  (this.props.formName === 'add-to-do') ? new Date() : this.state.date,
            });   
        }
    }

    formChange(evt){
        if(!evt.target){
            this.setState({description: this.reactQuillRef.current.value}, () => {
                this.submitForm();
            });
            return;
        }
        this.setState({[evt.target.name]: evt.target.value.toString()}, () => {
            this.submitForm();
        });
    }

    render(){
        const isEdit = this.props.formName === 'Edit TODO';
        const formTitle = isEdit
            ? `Edit ${ this.props.todo.title }`
            : 'Add TODO';
        const classDetails = `modal-close waves-effect waves-green btn-flat ${ this.state.disabled ? 'disabled' : '' }`;
        return(
            <div
                ref={this.modalRef}
                id={this.props.modalId}
                className="modal modal-fixed-footer">
                <h4 className="modal-title">
                    {formTitle}
                </h4>
                <div className="modal-content modal-content-scrollable row">
                    <form className="col s12">
                        <div className="row">
                            <div className="input-field col s12">
                                <input
                                    placeholder="Title"
                                    id="todo_title"
                                    name="title"
                                    type="text"
                                    className="validate"
                                    onChange={ this.formChange }
                                    value={ this.state.title }
                                />
                                <label htmlFor="todo_title">Title*</label>
                            </div>
                            <div className="input-field col s12">
                                <ReactQuill theme="snow"
                                    name="description"
                                    ref={this.reactQuillRef}
                                    modules={this.state.modules}
                                    formats={this.state.formats}
                                    value={this.state.description}
                                    onChange={this.formChange}/>
                                <label htmlFor="todo_desc">Description*</label>
                            </div>
                        </div>
                        <StatusSelect isEdit={isEdit} status={this.state.status} formChange={this.formChange} />
                        <PrioritySelect formChange={this.formChange} priority={this.state.priority} />
                    </form>
                </div>
                <div className="modal-footer">
                <a id='add_to_do_btn'
                    href='#!'
                    className={classDetails}
                    onClick={!isEdit ? this.addTodo : this.editTodo} >
                    {!isEdit ? 'Add' : 'Edit'}
                </a> <a
                    href="#!"
                    className="modal-close waves-effect waves-green btn-flat"
                    >Close</a>
                </div>
            </div>
        );
    }
}