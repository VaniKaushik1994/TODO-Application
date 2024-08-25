import React from "react";
import { Comment } from "./Comment";
import { History } from "./History";
import ReactQuill  from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../assets/css/Quill.css';

export class Tabs extends React.Component{
    constructor(){
        super();
        this.quillRef = React.createRef();; // Quill instance
        this.reactQuillRef = React.createRef();; // ReactQuill component
        this.addComment = this.addComment.bind(this);
        this.resetComment = this.resetComment.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.newCommentOnState = this.newCommentOnState.bind(this);
        this.state = {
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
        }
    }

    addComment(){
        this.props.addAComment(this.state.comment);
        this.setState({comment: ''});
    }

    resetComment(){
        this.setState({comment: ''});
    }

    updateComment(comment){
        this.props.updateAComment(comment);
    }

    deleteComment(id){
        this.props.deleteAComment(id);
    }

    newCommentOnState(){
        if(this.reactQuillRef && this.reactQuillRef.current){
            this.setState({comment: this.reactQuillRef.current.value});
        }
    }

    componentDidMount() {
        this.attachQuillRefs();
      }
    
    componentDidUpdate() {
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

    render(){
        const comments = this.props.comments;
        const histories = this.props.histories;
        return(
            <div className="row">
                <div className="col s12">
                <ul className="tabs">
                    <li className="tab col s3"><a href="#comments">Comments</a></li>
                    <li className="tab col s3"><a href="#history">History</a></li>
                </ul>
                </div>
                <div id="comments" className="col s12">
                    <div className="comment_btn col s12 ">
                        <ReactQuill theme="snow"
                            ref={this.reactQuillRef}
                            modules={this.state.modules}
                            formats={this.state.formats}
                            value={this.state.comment}
                            onChange={this.newCommentOnState}/>
                        <div className="btn_section right">
                            <i className="material-icons edit-btn" onClick={this.addComment}>check</i>
                            <i className="material-icons cancel-btn" onClick={this.resetComment}>close</i>
                        </div>
                    </div>
                    <div className="comments_section">
                        {comments.map((comment) =>
                            <Comment
                                key={comment.id}
                                comment={comment}
                                updateComment={this.updateComment}
                                deleteComment={this.deleteComment}/>
                        )}
                    </div>
                </div>
                <div id="history" className="col s12">
                <div className="history_section">
                        {histories.map((history, index) =>
                            <History
                                key={index}
                                history={history}/>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}