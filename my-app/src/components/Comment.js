import React from "react";

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
            comment: ''
        }
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

    newCommentOnState(evt){
        this.setState({comment: evt.target.value});
    }

    updateComment(){
        this.props.updateComment({...this.props.comment, comment: this.state.comment});
        this.setState({editClicked: 0});
    }

    render(){
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
                            <textarea
                                name="comment"
                                id="comment_description"
                                className="materialize-textarea"
                                placeholder="Enter your comments..."
                                value={this.state.comment}
                                onChange={this.newCommentOnState}
                            />
                            <div className="btn_section right">
                                <i className="material-icons" onClick={this.updateComment}>check</i>
                                <i className="material-icons"onClick={this.resetComment}>close</i>
                            </div>
                        </div>
                        :
                        <p className="comment-text">
                            {this.props.comment.comment}
                        </p> 
                    }
                </div>
            <div className="comment-footer">
                <span className="updated-date">{new Date(this.props.comment.updated_at).toLocaleString()}</span>
                <button className="btn-flat edit-btn" onClick={this.editComment}>Edit</button>
                <button className="btn-flat delete-btn" onClick={this.deleteComment}>Delete</button>
            </div>
        </div>
        )
    }
}