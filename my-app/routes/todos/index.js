const express = require('express')
const router = express.Router();
const TODO = require('../../models/todo');

const logger = require('../../helper/logger').Logger;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

function getUsername({ req }){
	logger.info({ msg: ' === Getting username ==='});
	return req.session?.username || 'vani.kaushik@gmail.com';
}

function getBucketPath({ req }){
	logger.info({ msg: ' === Getting path ==='});
	return `./bucket/${ getUsername({ req }) }.json`
}

router.get('/', async (req, res) => {
	logger.info({msg: 'Getting TODOS'});
	new TODO().read({path: getBucketPath({req})}, ({err, data}) => {
		if(err){
			logger.error({ msg: err});
			return res.json({message: 'No Todos for today!!!'});
		}
		logger.success({action: 'SUCCESS', msg: 'TODO List Shared'});
		return res.json(data);
	});
});

router.get('/:id', async(req, res) => {
	logger.info({msg: `Getting todo ${ req.params.id }`});
	new TODO().getTodo({
		path: getBucketPath({req}),
		id: req.params.id
	}, ({todo, comments, histories}) => {
		logger.success({msg: 'Sharing TODO Details, Comments and Histories'});
		return res.json({todo, comments, histories});
	});
});

router.post('/add', (req, res) => {
	logger.info({ msg: 'Adding todo'});
	new TODO().insert({
		path: getBucketPath({req}),
		todo: req.body.todo,
		username: getUsername({ req }),
	}, ({message, todos}) => {
		if(message){
			logger.error({ msg: message});
		} else {
			logger.success({ msg: 'TODO Addedd'});
		}
		return res.json({message, todos});
	});
});

router.delete('/delete', (req, res) => {
	logger.info({msg: 'Initiating Delete of todo'});
	new TODO().delete({
		path: getBucketPath({ req }),
		index: req.body.index,
		username: getUsername({ req }),
	}, ({message, todos}) => {
		if(message){
			logger.error({msg: message});
		} else {
			logger.success({ msg: 'TODO Deleted'});
		}
		return res.json({message, todos});
	});
});

router.put('/edit', (req, res) => {
	logger.info({ msg: 'Initiating update of todo'});
	new TODO().update({
		path: getBucketPath({ req }),
		todo: req.body.todo,
		username: getUsername({ req }),
		action: req.body.action
	}, ({message, todos}) => {
		if(message){
			logger.error({msg: message});
		} else {
			logger.success({msg: 'TODO Updated'});
		}
		return res.json({message, todos});
	});
});

router.use('/comments', require('./comments'));
module.exports = router;