import React from "react";
import ReactQuill  from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import '../assets/css/Quill.css';
import '../assets/css/Comment.css';

export class Comment extends React.Component{
    constructor(){
        super();
        this.editComment = this.editComment.bind(this);
        this.newCommentOnState = this.newCommentOnState.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.resetComment = this.resetComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.state = {
            editClicked: 0,
            comment: '',
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
            ]
        };
        this.quillRef = React.createRef();; // Quill instance
        this.reactQuillRef = React.createRef();; // ReactQuill component
    }

    deleteComment(){
        this.props.deleteComment({id: this.props.comment.id});
    }

    editComment(){
        this.setState({editClicked: 1, comment: this.props.comment.comment}, () => {});
    }
    resetComment(){
        this.setState({editClicked: 0, comment: this.props.comment.comment});
    }

    newCommentOnState(){
        if(this.reactQuillRef && this.reactQuillRef.current){
            this.setState({comment: this.reactQuillRef.current.value});
        }
    }

    updateComment(){
        this.props.updateComment({...this.props.comment, comment: this.state.comment});
        this.setState({editClicked: 0});
    }

    componentDidMount() {
        this.attachQuillRefs();
      }
    
    componentDidUpdate() {
        this.attachQuillRefs();
    }

    attachQuillRefs = () => {
    if (typeof this.reactQuillRef?.getEditor !== 'function') return;
        this.quillRef = this.reactQuillRef?.getEditor();
    };

    render(){
        const sanitizedHtml = DOMPurify.sanitize(this.props.comment.comment);
        return(
        <div className="comment">
            <div className="comment-header">
                <div className="user-info">
                    <i className="material-icons" alt="User Avatar">account_circle</i>
                    <span className="username">{this.props.comment.commentor}</span>
                </div>
            </div>
                <div className="comment-body">
                    {this.state.editClicked ?
                        <div className="comment_btn col s12 ">
                            <ReactQuill theme="snow"
                                ref={this.reactQuillRef}
                                modules={this.state.modules}
                                formats={this.state.formats}
                                value={this.state.comment}
                                onChange={this.newCommentOnState}/>
                            <div className="btn_section right">
                                <i className="material-icons edit-btn" onClick={this.updateComment}>check</i>
                                <i className="material-icons cancel-btn"onClick={this.resetComment}>close</i>
                            </div>
                        </div>
                        :
                        <p className="comment-text" dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></p> 
                    }
                </div>
            {!this.state.editClicked 
            ? <div className="comment-footer">
                <span className="updated-date">{new Date(this.props.comment.updated_at).toLocaleString()}</span>
                <button className="btn-flat edit-btn" onClick={this.editComment}>Edit</button>
                <button className="btn-flat delete-btn" onClick={this.deleteComment}>Delete</button>
            </div>
            : ''}
        </div>
        )
    }
}