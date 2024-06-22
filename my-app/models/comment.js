const fs = require('fs');
const History = require('./history');
const PREFIX = 'Comment';
const MAX_GET_TIME = 9999999999999;

const logger = require('../helper/logger').Logger;

class Comment{
    getZeros({lastIdCount}){
        logger.info({msg: 'Comment get zeros function'});
        if(lastIdCount < 10){
            logger.info({msg: 'Returning 00'});
            return '00';
        }
        if(lastIdCount >= 10 && lastIdCount <= 99 ){
            logger.info({msg: 'Returning 0'});
            return '0';
        }
        logger.info({msg: 'Returning nothing'});
        return '';
    }
    getDate(date){
        date = date || new Date();
        logger.info({msg: 'Comment get date function'});
        return MAX_GET_TIME - date.getTime();
    }
    generateId({ lastIdCount }){
        logger.info({msg: 'Comment generate ID function'});
        if(typeof lastIdCount !== 'number'){
            lastIdCount = parseInt(lastIdCount);
            if(isNaN(lastIdCount)){
                logger.error({msg: 'lastIdCount should be a number'});
                return '';
            }
        }
        lastIdCount += 1;
        return `${ PREFIX }${ this.getZeros({lastIdCount}) }${ lastIdCount }`
    }
    async read({path}, callback){
        if(!path){
            return callback({data: 'Path not send.'});
        }
        logger.info({msg: `${ path } file being read in comment`});
        fs.readFile(path, 'utf8', (err, data) => {
            if(err){
                logger.error({msg: err});
                return callback({
                    data: {
                        rev: 0,
                        id_count: 0,
                        comments: [],
                    }
                });
            }
            logger.success({msg: 'File read success'});
            return callback({data: JSON.parse(data)});
        });
    }
    write({path, comments, action}, callback){
        if(!path){
            return callback({err: 'Cannot write on undefined path'});
        }
        if(!comments){
            return callback({err: 'Cannot write an undefined value in path'});
        }
        logger.info({ msg: `${ path } file is being written!!`});
        if(comments.rev >= 0){
            comments.rev += 1;
        } else {
            comments.rev = 0;
        }
        if(action === 'insert'){
            if(comments.id_count){
                comments.id_count += 1;
            } else {
                comments.id_count = 1;
            }
        }
        fs.writeFile(path, JSON.stringify(comments), (err, data) => {
            if(err){
                logger.error({msg: err});
                return callback({ message: 'Facing error while updating comment!!!'});
            }
            logger.success({msg: 'Write on comment successful'});
            return callback({comments});
        });
    }
    processComment({comment, data, username, action}){
        logger.info({msg: 'Process comment success'});
        if(!comment || !data || !username){
            return false;
        }
        return {
            comment: (action === 'insert') ? comment : comment.comment,
            id: (action === 'insert') ?  this.generateId({ lastIdCount: data.id_count }) : comment.id,
            date: this.getDate(),
            commentor: username,
            created_at: comment.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString() 
        }
    }
    async insert({path, comment, username, todoId}, callback){
        if(!path || !comment || !username || !todoId){
            return callback({err: true});
        }
        logger.info({msg: 'Comment insert function'});
        this.read({path}, ({data}) => {
            comment = this.processComment({comment, data, username, action: 'insert'});
            if(data.comments){
                data.comments.push(comment);
            } else {
                data = {
                    comments: [comment],
                }
            }
            this.updateHistory({
                action: 'comment-add',
                current: comment.comment,
                username,
                id: todoId,
            }, ({success, failure}) => {
                if(failure){
                    callback({ err: 'Something went wrong!!'});
                    return;
                }
                logger.success({msg: 'Comment added success'});
                this.write({path, comments: data, action: 'insert'}, callback);
            });
            
        });
    }
    update({path, comment, username, todoId}, callback){
        if(!path || !comment || !username || !todoId){
            return callback({err: true});
        }
        logger.info({msg: 'Comment Update function'});
        this.read({path}, ({data}) => {
            const index = data.comments?.findIndex((element) => element.id === comment.id);
            if(index < 0){
                return callback({ err: 'Something went wrong!!' });
            }
            comment = this.processComment({comment, data, username, action: 'update'});
            this.updateHistory({
                action: 'comment-edit',
                prev: data.comments[index].comment,
                current: comment.comment,
                username,
                id: todoId,
            }, ({success, failure}) => {
                if(failure){
                    callback({ err: 'Something went wrong!!'});
                    return;
                }
                data.comments[index] = comment;
                logger.success({msg: 'Comment updated success'});
                this.write({path, comments: data, action: 'update'}, callback);
            });
        });
    }
    delete({path, id, username, todoId}, callback){
        if(!path || !id || !username || !todoId){
            return callback({err: true});
        }
        logger.info({msg: 'Comment delete function'});
        this.read({path}, ({data}) => {
            const index = data.comments?.findIndex((comment) => comment.id === id);
            if(index < 0){
                return callback({err: 'Something went wrong'});
            }
            this.updateHistory({
                action: 'comment-delete',
                prev: data.comments[index].comment,
                username,
                id: todoId,
            }, ({success, failure}) => {
                if(failure){
                    callback({ err: 'Something went wrong!!'});
                    return;
                }
                logger.success({msg: 'Comment deleted success'});
                data.comments.splice(index, 1);
                this.write({path, comments: data, action: 'delete'}, callback);
            });            
        });
    }
    updateHistory({id, action, prev, current, username}, callback){
        new History().insert({
            action,
            id,
            prev,
            current,
            username
        }, callback);
    }
}

module.exports = Comment;