const express = require('express')
const router = express.Router();
const Comment = require('../../../models/comment.js');


const logger = require('../../../helper/logger.js').Logger;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

function getBucketPath({ req }){
	logger.info({ msg: ' === Getting path for comments ==='});
	return `./bucket/comments/${ getTodoId({ req }) }.json`
}

function getTodoId({ req }){
	logger.info({msg: `CRUD on comment for todo: ${req.body.id || req.params.todoId}`});
	return req.body.id || req.params.todoId;
}

function getUsername({ req }){
	logger.info({
		msg: `username: ${ req?.session?.displayName || 'Vani Kaushik' } perferoming CRUD on Comment`
	});
	return req?.session?.displayName || 'Vani Kaushik';
}

router.get('/', async (req, res) => {
	logger.info({msg: 'Getting Comments of a TODO'});
	new Comment().read({path: getBucketPath({req})}, ({err, data}) => {
		if(err){
			logger.error({msg: err});
			return res.json({message: 'No Comments added!!!'});
		}
		logger.success({msg: 'All comments shared successfully'});
		return res.json(data);
	});
});

router.post('/add', (req, res) => {
	logger.info({msg: '==== Add a Comment ===='});
	new Comment().insert({
		path: getBucketPath({req}),
		comment: req.body.comment,
        username: getUsername({ req }),
		todoId: getTodoId({ req })
	}, ({message, comments}) => {
		if(message){
			logger.error({msg: message});
		} else {
			logger.success({msg: 'Comment added sucessfully!!'});
		}
		return res.json({message, comments});
	});
});

router.delete('/:todoId/:id', (req, res) => {
	logger.info({msg: '==== Delete a Comment ===='});
	new Comment().delete({
		path: getBucketPath({ req }),
		id: req.params.id,
		todoId: getTodoId({ req }),
		username: getUsername({ req })
	}, ({message, comments}) => {
		if(message){
			logger.error({msg: message});
		} else {
			logger.success({msg: 'Comment deleted sucessfully!!'});
		}
		return res.json({message, comments});
	});
});

router.put('/:id', (req, res) => {
	logger.info({msg: '==== Edit a Comment ===='});
	new Comment().update({
		path: getBucketPath({ req }),
		comment: req.body.comment,
        username: getUsername({ req }),
		todoId: getTodoId({ req })
	}, ({message, comments}) => {
		if(message){
			logger.error({msg: message});
		} else {
			logger.success({msg: 'Comment edited sucessfully!!'});
		}
		return res.json({message, comments});
	});
});

module.exports = router;