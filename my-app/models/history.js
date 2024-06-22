const fs = require('fs');
const PREFIX = 'HISTORY_TODO';
const HISTORY_BOOK_PREFIX = {
    created: ' created a ticket on ',
    status: ' changed the status to ',
    priority: ' changed the priority to ',
    description: ' changed the description to ',
    title: ' changed the title to ',
    comment: {
        add: ' added a comment: ',
        delete: ' deleted a comment: ',
        edit: ' edited a comment: ',
    }
};

const logger = require('../helper/logger').Logger;

class History{
    generateId({ todoId }){
        logger.info({msg: 'History generate id function'});
        return `${ PREFIX }${ todoId }`
    }
    generatePath({ id }){
        const path = `./bucket/history/${ id }.json`;
        logger.info({msg: `History generate path function: ${ path }`});
        return `./bucket/history/${ id }.json`;
    }
    read({path}, callback){
        logger.info({msg: `History read function`});
        fs.readFile(path, 'utf8', (err, data) => {
            if(err){
                logger.error({msg: err});
                callback({data: {history: [], rev: 0}});
                return;
            }
            logger.success({msg: `History read from path ${ path }`});
            callback({data: JSON.parse(data)});
        });
    }
    write({path, history}, callback){
        logger.info({msg: `History write function`});
        if(history?.rev >= 0 ){
            history.rev += 1;
        } else {
            history.rev = 0;
        }
        fs.writeFile(path, JSON.stringify(history), (err, data) => {
            if(err){
                logger.error({ msg: err});
                return callback({ failure: true});
            }
            logger.success({msg: 'History Written successfully!!'});
            return callback({success: true});
        })
    }
    insert({id, action, prev, current, username}, callback){
        logger.info({msg: 'History Insert function'});
        const path = this.generatePath({ id });
        this.read({path}, ({err, data}) => {
            data.history.push({
                description: this.getHistoryDescription({action, prev, current, username}),
                date: new Date().getTime()
            })
            this.write({path, history: data}, callback);
        });
    }
    getHistoryDescription({action, prev, current, username}){
        logger.info({msg: `get history description for ${action}`});
        const currentToPrevStr = `${current} from ${ prev }`;
        switch(action){
            case 'created':
                return `${ username }${ HISTORY_BOOK_PREFIX[action] }`;
            case 'status': case 'priority': case 'description': case 'title':
                return `${ username  }${ HISTORY_BOOK_PREFIX[action] }${ currentToPrevStr}`;
            case 'comment-add': case 'comment-edit': case 'comment-delete':
                return`${ username }${ this.getCommentDescription({action, current, prev}) }`
            default:
                logger.error({msg: 'Wrong action encountered'});
        }
    }
    getCommentDescription({action, current, prev}){
        logger.info({msg: 'get comment description'});
        switch(action){
            case 'comment-add':
                return `${ HISTORY_BOOK_PREFIX.comment.add }${ current }`;
            case 'comment-edit':
                return `${ HISTORY_BOOK_PREFIX.comment.edit }${ prev } to ${ current }`;
            case 'comment-delete':
                return `${ HISTORY_BOOK_PREFIX.comment.delete} ${ prev }`;
            default:
                logger.error({ msg: 'Wrong comment action triggered'});
        }
    }
}

module.exports = History;