const fs = require('fs');
const Comments = require('../models/comment');
const History = require('../models/history');
const PREFIX = 'TODO';

const logger = require('../helper/logger').Logger;

class TODO{
    getZeros({lastIdCount}){
        logger.info({ msg: 'get zeros function' });
        if(lastIdCount < 10){
            logger.info({ msg: 'returning 00'});
            return '00';
        }
        if(lastIdCount >= 10 && lastIdCount <= 99 ){
            logger.info({ msg: 'returning 0'});
            return '0';
        }
        logger.info({ msg: 'returning nothing'});
        return '';
    }
    generateId({ lastIdCount }){
        logger.info({msg: 'generate id function'});
        lastIdCount += 1;
        const id = `${ PREFIX }${ this.getZeros({lastIdCount}) }${ lastIdCount }`;
        logger.info({msg: 'returning id'});
        return id;
    }
    read({path}, callback){
        logger.info({msg: 'TODO read function'});
        fs.readFile(path, 'utf8', (err, data) => {
            if(err){
                logger.error({ msg: err});
            } else {
                logger.success({msg: `File path ${ path } read success`});
            }
            callback({err, data});
        });
    }
    async getTodo({path, id}, callback){
        logger.info({msg: 'get a particular todo function'});
        this.read({path}, ({err, data}) => {
            data = err ? [] : JSON.parse(data);
            const todo = data.todos.find(el => el.id === id);;
            new Comments().read({path: `./bucket/comments/${ id }.json`}, ({ data }) => {
                const comments = data.comments;
                new History().read({ path: `./bucket/history/${ id }.json`}, ({data}) =>{
                    logger.success({msg: 'Passing todo, comments, histories'});
                    callback({todo, comments, histories: data.history});
                    return;
                });
            });
        });
    }
    
    write({path, todos, action}, callback){
        logger.info({msg: 'TODO Write function'});
        todos.rev += 1;
        if(action === 'insert'){
            todos.id_count += 1;
        }
        fs.writeFile(path, JSON.stringify(todos), (err, data) => {
            if(err){
                logger.error({ msg: err});
                return callback({ message: 'Facing error while updating todo!!!'});
            }
            logger.success({msg: `TODO File ${ path } updated success`});
            callback({todos});
        })
    }
    insert({path, todo, username}, callback){
        logger.info({msg: 'Insert Todo function'});
        this.read({path}, ({err, data}) => {
            data = err ? [] : JSON.parse(data);
            todo.id = this.generateId({ lastIdCount: data.id_count });
            data.todos.push(todo);
            this.updateHistory({
                action: 'created',
                current: todo.title,
                username,
                id: todo.id,
            }, ({success, failure}) => {
                if(failure){
                    callback({ err: 'Something went wrong!!'});
                    return;
                }
                logger.success({msg: 'Todo inserted successfully'});
                this.write({path, todos: data, action: 'insert'}, callback);
            });
        });
    }
    update({path, todo, action, username}, callback){
        logger.info({msg: 'Update todo function'});
        this.read({path}, ({err, data}) => {
            data = err ? [] : JSON.parse(data);
            const index = data.todos.findIndex(el => el.id === todo.id);
            this.updateHistory({
                action,
                current: todo[action],
                prev: data.todos[index][action],
                username,
                id: todo.id,
            }, ({success, failure}) => {
                if(failure){
                    callback({ err: 'Something went wrong!!'});
                    return;
                }
                logger.success({msg: 'Todo updated successfully'});
                data.todos[index] = todo;
                this.write({path, todos: data, action: 'update'}, callback);
            });
        });
    }
    delete({path, index}, callback){
        logger.info({msg: 'Todo delete function'});
        this.read({path}, ({err, data}) => {
            data = err ? [] : JSON.parse(data);
            data.todos.splice(index, 1);
            logger.success({msg: 'Todo deleted successfully'});
            this.write({path, todos: data, action: 'delete'}, callback);
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

module.exports = TODO;