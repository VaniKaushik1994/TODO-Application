import React from "react";
import { Comment } from "./Comment";
import { History } from "./History";

export class Tabs extends React.Component{
    constructor(){
        super();
        this.addComment = this.addComment.bind(this);
        this.resetComment = this.resetComment.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    addComment(){
        const element = document.getElementById('comment_description')
        this.props.addAComment(element.value);
        element.value = '';
    }

    resetComment(){
        const element = document.getElementById('comment_description')
        element.value = '';
    }

    updateComment(comment){
        this.props.updateAComment(comment);
    }

    deleteComment(id){
        this.props.deleteAComment(id);
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
                        <textarea
                            name="comment"
                            id="comment_description"
                            className="materialize-textarea"
                            placeholder="Enter your comments..."
                        />
                        <div className="btn_section right">
                            <i className="material-icons" onClick={this.addComment}>check</i>
                            <i className="material-icons" onClick={this.resetComment}>close</i>
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