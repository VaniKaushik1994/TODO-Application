const Comment = require('./comment');
const fs = require('fs');
const logger = require('../helper/logger').Logger;

describe('Get zeros function', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
	it('Get 00 as output for last id count to be between 0 to 9', () => {
		const infoLogger = jest.spyOn(logger, 'info');
		const value = new Comment().getZeros({lastIdCount: 9});
		expect(value).toBe('00');
		expect(infoLogger).toHaveBeenCalledTimes(2);
		expect(infoLogger.mock.calls[0][0]).toEqual({msg: 'Comment get zeros function'});
		expect(infoLogger.mock.calls[1][0]).toEqual({msg: 'Returning 00'});
	});
	it('Get 0 as output for last id count to be between 10 to 99', () => {
		expect(new Comment().getZeros({lastIdCount: 10})).toBe('0');
	});
	it('Get an empty string for last id count greater than 99', () => {
		expect(new Comment().getZeros({lastIdCount: 999})).toBe('');
	});
	it('Logger Info Hit Success', () => {
		const spy = jest.spyOn(logger, 'info'); // Spy on the logger's info method
		new Comment().getZeros({lastIdCount: 999});
		expect(spy).toHaveBeenCalledTimes(2); // Expect logger.info to be called once
		expect(spy.mock.calls[0][0]).toEqual({ msg: 'Comment get zeros function' }); // Check the first call's message
		expect(spy.mock.calls[1][0]).toEqual({msg: 'Returning nothing'});
	});
});

describe('Generate ID', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
   it('Last Id count being a number returns a proper id', () => {
		expect(new Comment().generateId({lastIdCount: 4}))
			.toBe('Comment005');
   });
   it('Last id count being a number in string should convert to number', () => {
		expect(new Comment().generateId({lastIdCount: '4'}))
			.toBe('Comment005');
   });
   it('Last ID count being any string returns empty string', () => {
		const spyInfo = jest.spyOn(logger, 'info');
		const value = new Comment().generateId({lastIdCount: 'lastIdCount'})
		expect(value).toBe('');
		expect(spyInfo).toHaveBeenCalledTimes(1);
		expect(spyInfo.mock.calls[0][0]).toEqual({ msg: 'Comment generate ID function' }); // Check the first call's message
   });
   it('Last ID count being undefined returns empty string', () => {
		expect(new Comment().generateId({})).toBe('');
	});
});

describe('Get Date', () => {
	it('Testing get time', () => {
		const date = new Date();
		expect(new Comment().getDate(date)).toBe(9999999999999 - date.getTime());
	});
});

describe('Read function', () => {
	const mockDataSuccess = {rev: 1, id_count: 1, comments: [{comment: 'hello'}]}; // Assuming createMockData function exists
	const path = 'path/to/file';
	const mockFs = {
		readFile: jest.fn(),
		writeFile: jest.fn()
	};
	const comment = new Comment();
	
	afterEach(() => {
		jest.resetAllMocks();
	});
	
	it('Throw error on path being not send', async () => {
		const comment = new Comment();
		const callback = jest.fn();
		await comment.read({}, callback); // Call read without path argument
		expect(callback).toHaveBeenCalledWith({ data: 'Path not send.' });
	});
	it('Expect read function getting hit', () => {
		const spyInfo = jest.spyOn(logger, 'info');
		const spySuccess = jest.spyOn(logger, 'success');
		const mockFsReadFile = jest.spyOn(fs, 'readFile');
		const instance = new Comment();
		const read = jest.spyOn(instance, 'read');
		const mockReadData = "{\"comments\":[{\"comment\":\"test\"}]}"
		mockFsReadFile.mockResolvedValue({data: mockReadData})
		instance.read({path: 'text.json'}, ({data}) => {
			expect(spyInfo).toHaveBeenCalledTimes(1); // Expect logger.info to be called once
			expect(spyInfo.mock.calls[0][0]).toEqual({ msg: `${path} file being read in comment` });
			expect(read).toHaveBeenCalled();
			expect(spySuccess).toHaveBeenCalledTimes(1); // Expect logger.info to be called once
			expect(spySuccess.mock.calls[0][0]).toEqual({ msg: 'File read success' });
			expect(data).toBe( JSON.parse(mockReadData));
		});
		
	});
	it('Comment.read reads file error return', async () => {
		const error = new Error('Read error');
		mockFs.readFile.mockRejectedValue(error);
		const spyInfo = jest.spyOn(logger, 'info');
		const spyError = jest.spyOn(logger, 'error');
		await comment.read({ path }, ({data}) => {
			expect(data.rev).toBe(0);
			expect(mockFs.readFile).toHaveBeenCalledWith(path, 'utf8'); // Verify fs.readFile call
			expect(spyInfo).toHaveBeenCalledTimes(1); // Expect logger.info to be called once
			expect(spyInfo.mock.calls[0][0]).toEqual({ msg: `${path} file being read in comment` }); // Check the first call's message
			expect(spyError).toHaveBeenCalledTimes(1);
			expect(spyError.mock.calls[0][0]).toEqual({msg: error});
		});
	});
	it('Comment.read reads file successfully', async () => {
		mockFs.readFile.mockResolvedValue({data: mockDataSuccess});
		const spyInfo = jest.spyOn(logger, 'info');
		const spySuccess = jest.spyOn(logger, 'success');
		await comment.read({ path }, ({data}) => {
			expect(data.rev).toBe(1);
			expect(mockFs.readFile).toHaveBeenCalledWith(path, 'utf8'); // Verify fs.readFile call
			expect(spyInfo).toHaveBeenCalledTimes(1); // Expect logger.info to be called once
			expect(spyInfo.mock.calls[0][0]).toEqual({ msg: `${path} file being read in comment` }); // Check the first call's message
			expect(spySuccess).toHaveBeenCalledTimes(1);
			expect(spySuccess.mock.calls[0][0]).toEqual({msg: 'File read success'});
		});
	});  
});

describe('Write Function', () => {
	const mock = {
		write: ({path, comments, action}, callback) => {
			if(!path){
				return callback({err: 'Cannot write on undefined path'});
			}
			if(!comments || comments.length === 0){
				return callback({err: 'Cannot write an undefined value in path'});
			}
			fs.writeFile(path, JSON.stringify(comments), (err, data) => {
				if(err){
					return callback({ message: 'Facing error while updating comment!!!'});
				}
				return callback({comments});
			})
		}
	};
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('write throws error for undefined path', () => {
		const callback = jest.fn();
		new Comment().write({ comments: 'data', action: 'insert' }, callback);
		expect(callback).toHaveBeenCalledWith({ err: 'Cannot write on undefined path' });
		expect(logger.info).not.toHaveBeenCalled(); // Logger shouldn't be called
	});

	it('write throws error for undefined comments', () => {
		const callback = jest.fn();
		new Comment().write({ path: 'path/to/file' }, callback);
		expect(callback).toHaveBeenCalledWith({ err: 'Cannot write an undefined value in path' });
		expect(logger.info).not.toHaveBeenCalled(); // Logger shouldn't be called
	});
	  
	it('write logs info message for valid write', () => {
		const callback = jest.fn();
		new Comment().write({ path: 'path/to/file', comments: { rev: 1 }, action: 'insert' }, callback);
		expect(callback).not.toHaveBeenCalled(); // Callback not called for successful write (implementation specific)
		expect(logger.info).toHaveBeenCalledWith({ msg: 'path/to/file file is being written!!' });
	});

	it('write increments rev for valid write', () => {
		const mockComments = { rev: 1, id_count: 2 };
		const callback = jest.fn();
		new Comment().write({ path: 'path/to/file', comments: mockComments, action: 'insert' }, callback);
		expect(callback).not.toHaveBeenCalled(); // Callback not called for successful write (implementation specific)
		expect(mockComments.rev).toBe(2); // Verify rev is incremented
	});
	  
	it('write sets rev to 0 for negative rev', () => {
		const mockComments = { rev: -1, id_count: 2 };
		const callback = jest.fn();
		new Comment().write({ path: 'path/to/file', comments: mockComments, action: 'insert' }, callback);
		expect(callback).not.toHaveBeenCalled(); // Callback not called for successful write (implementation specific)
		expect(mockComments.rev).toBe(0); // Verify rev is set to 0
	});
	
	it('get error while reading a file', () => {
		const mockFs = {
			readFile: jest.fn(),
			writeFile: jest.fn()
		};
		const comment = new Comment(mockFs);
		mockFs.readFile.mockRejectedValue(new Error('Read Error'));
		comment.write({path: 123, comments: [{comment: 'Hellos'}], action: 'write'}, ({message, comments}) =>{
			expect(message).toBe('Facing error while updating comment!!!');
			expect(mockFs.readFile).toHaveBeenCalledTimes(1);
		});
	});
	it('Write the data in file', async () => {
		const commentList = [{comment: 'Hello'}];
		await mock.write({
			path: 'test.json',
			comments: commentList,
			action: 'insert'
		}, ({err, comments}) => {
			expect(comments).toBe(commentList);
		});
	});
});

describe('Process Comment Function', () => {
	it('Testing the error on not sending parameter', () => {
		expect(new Comment().processComment({})).toBe(false);
	})
	it('Testing the return value', () => {
		const processedValue = new Comment().processComment({
			comment: 'Hi',
			data: {id_count: 1},
			username: 'Vani Kaushik',
			action: 'insert'
		});
		expect(processedValue['commentor']).toBe('Vani Kaushik');
	});
});

describe('Insert Function', () => {
	it('throws error on missing required fields', () => {
		const callback = jest.fn();
	
		new Comment().insert({}, callback);
		new Comment().insert({ path: 'some/path' }, callback);
		new Comment().insert({ comment: 'This is a comment' }, callback);
		new Comment().insert({ username: 'john.doe' }, callback);
		new Comment().insert({ todoId: 123 }, callback);
	
		expect(callback).toHaveBeenCalledTimes(5);
		callback.mock.calls.forEach(([err]) => {
		  expect(err).toBeTruthy();
		  expect(err).toHaveProperty('err', true);
		});
	});
	it('Comment insert - Success', async () => {
		const path = 'test.json';
		const comment = 'This is a test comment';
		const username = 'johndoe';
		const todoId = 123;
		const mockData = { id_count: 0, comments: [] };
	  
		const mockRead = jest.fn().mockImplementation(({path}, callback) => {
			callback({ data: mockData });
		});
	  
		const mockUpdateHistory = jest.fn().mockImplementation((data, callback) => {
			callback({ success: true });
		});
	  
		const mockWrite = jest.fn().mockImplementation((data, callback) => {
			callback({ comments: mockData });
		});
	  
		const commentClass = new Comment({
			read: mockRead,
			updateHistory: mockUpdateHistory,
			write: mockWrite,
		});
	  
		await commentClass.insert({ path, comment, username, todoId }, ({comments}) => {
			expect(mockRead).toHaveBeenCalled();
			expect(mockUpdateHistory).toHaveBeenCalled();
			expect(mockWrite).toHaveBeenCalled();
			expect(comments).toEqual(mockData);
		});
	});
	it('updates history and writes data on successful comment addition', async () => {;
		const mockData = { id_count: 0, comments: [] };

		const mockRead = jest.fn().mockImplementation(({path}, callback) => {
			callback({ data: mockData });
		});
	  
		const mockUpdateHistory = jest.fn().mockImplementation((data, callback) => {
			callback({ success: true });
		});
	  
		const mockWrite = jest.fn().mockImplementation((data, callback) => {
			callback({ comments: mockData });
		});

		const commentClass = new Comment({
			read: mockRead,
			updateHistory: mockUpdateHistory,
			write: mockWrite,
		});
	
		const callback = jest.fn();
		await commentClass.insert({ path: 'some/path', comment: 'This is a comment', username: 'jane.doe', todoId: 456 }, ({err, data}) => {
			expect(mockUpdateHistory).toHaveBeenCalledWith({
				action: 'comment-add',
				current: 'This is a comment (processed)', // Assuming processedComment modifies comment
				username: 'jane.doe',
				id: 456,
			});
			expect(mockWrite).toHaveBeenCalledWith({ path: 'some/path', comments: { comments: ['This is a comment (processed)'] }, action: 'insert' });
			expect(callback).toHaveBeenCalledWith(null); // No error, successful insertion
		});
	});
});

describe('Update Function', () => {
	it('throws error on missing required fields', () => {
		const callback = jest.fn();
	
		new Comment().update({}, callback);
		new Comment().update({ path: 'some/path' }, callback);
		new Comment().update({ comment: 'This is a comment' }, callback);
		new Comment().update({ username: 'john.doe' }, callback);
		new Comment().update({ todoId: 123 }, callback);
	
		expect(callback).toHaveBeenCalledTimes(5);
		callback.mock.calls.forEach(([err]) => {
		  expect(err).toBeTruthy();
		  expect(err).toHaveProperty('err', true);
		});
	});
	it('Update comment - success', async() => {
		const path = 'test.json';
		const comment = {comment: 'This is a test comment', id: 'Comment_001'};
		const username = 'johndoe';
		const todoId = 123;
		const mockData = { id_count: 1, comments: [{
			id: 'Comment_001',
			comment: 'test',
		}] };
	  
		const mockRead = jest.fn().mockImplementation(({path}, callback) => {
			callback({ data: mockData });
		});
	  
		const mockUpdateHistory = jest.fn().mockImplementation((data, callback) => {
			callback({ success: true });
		});
	  
		const mockWrite = jest.fn().mockImplementation((data, callback) => {
			callback({ comments: data });
		});
	  
		const commentClass = new Comment({
			read: mockRead,
			updateHistory: mockUpdateHistory,
			write: mockWrite,
		});
	  
		await commentClass.update({ path, comment, username, todoId }, ({comments}) => {
			expect(mockRead).toHaveBeenCalled();
			expect(mockUpdateHistory).toHaveBeenCalled();
			expect(mockWrite).toHaveBeenCalled();
			expect(comments).toEqual(mockData);
		});
	});
	it('updates history and writes data on successful comment updation', async () => {;
		const mockData = { id_count: 0, comments: [{comment: 'This is a comment', id: 'Comment_001'}] };

		const mockRead = jest.fn().mockImplementation(({path}, callback) => {
			callback({ data: mockData });
		});
	  
		const mockUpdateHistory = jest.fn().mockImplementation((data, callback) => {
			callback({ success: true });
		});
	  
		const mockWrite = jest.fn().mockImplementation((data, callback) => {
			callback({ comments: mockData });
		});

		const commentClass = new Comment({
			read: mockRead,
			updateHistory: mockUpdateHistory,
			write: mockWrite,
		});
		const callback = jest.fn();
		await commentClass.update({
			path: 'some/path',
			comment: {comment: 'This is a comment update', id: 'Comment_001'},
			username: 'jane.doe',
			todoId: 456 }, callback => {
			expect(mockUpdateHistory).toHaveBeenCalledWith({
				action: 'comment-edit',
				prev: 'This is a comment',
				current: 'This is a comment update', // Assuming processedComment modifies comment
				username: 'jane.doe',
				id: 456,
			});
			expect(mockWrite).toHaveBeenCalledWith({ path: 'some/path', comments: { comments: ['This is a comment update'] }, action: 'update' });
			expect(callback).toHaveBeenCalledWith(null); // No error, successful insertion
		});
	});
});

describe('Delete Function', () => {
	it('throws error on missing required fields', () => {
		const callback = jest.fn();
		new Comment().delete({}, callback);
		new Comment().delete({ path: 'some/path' }, callback);
		new Comment().delete({ comment: 'This is a comment' }, callback);
		new Comment().delete({ username: 'john.doe' }, callback);
		new Comment().delete({ todoId: 123 }, callback);
	
		expect(callback).toHaveBeenCalledTimes(5);
		callback.mock.calls.forEach(([err]) => {
		  expect(err).toBeTruthy();
		  expect(err).toHaveProperty('err', true);
		});
	});
	it('Delete comment - success', async() => {
		const path = 'test.json';
		const username = 'johndoe';
		const todoId = 123;
		const mockDataRead = { id_count: 1, comments: [{
			id: 'Comment_001',
			comment: 'test',
		}] };
		const mockDataWrite = { id_count: 1, comments: [] };
	  
		const mockRead = jest.fn().mockImplementation(({path}, callback) => {
			callback({ data: mockDataRead });
		});
	  
		const mockUpdateHistory = jest.fn().mockImplementation((data, callback) => {
			callback({ success: true });
		});
	  
		const mockWrite = jest.fn().mockImplementation((data, callback) => {
			callback({ comments: mockDataWrite });
		});
	  
		const commentClass = new Comment({
			read: mockRead,
			updateHistory: mockUpdateHistory,
			write: mockWrite,
		});
	  
		await commentClass.delete({ path, id: 'Comment_001', username, todoId }, ({comments}) => {
			expect(mockRead).toHaveBeenCalled();
			expect(mockUpdateHistory).toHaveBeenCalled();
			expect(mockWrite).toHaveBeenCalled();
			expect(comments).toEqual(mockDataWrite.comments);
		});
	});
	it('updates history and writes data on successful comment deletion', async () => {;
		const mockData = { id_count: 0, comments: [{comment: 'This is a comment', id: 'Comment_001'}] };

		const mockRead = jest.fn().mockImplementation(({path}, callback) => {
			callback({ data: mockData });
		});
	  
		const mockUpdateHistory = jest.fn().mockImplementation((data, callback) => {
			callback({ success: true });
		});
	  
		const mockWrite = jest.fn().mockImplementation((data, callback) => {
			callback({ comments: mockData });
		});

		const commentClass = new Comment({
			read: mockRead,
			updateHistory: mockUpdateHistory,
			write: mockWrite,
		});
		const callback = jest.fn();
		await commentClass.delete({
			path: 'some/path',
			id: 'Comment_001',
			username: 'jane.doe',
			todoId: 456 }, callback => {
			expect(mockUpdateHistory).toHaveBeenCalledWith({
				action: 'comment-delete',
				prev: 'This is a comment',
				username: 'jane.doe',
				id: 456,
			});
			expect(mockWrite).toHaveBeenCalledWith({ path: 'some/path', comments: [], action: 'delete' });
			expect(callback).toHaveBeenCalledWith(null); // No error, successful insertion
		});
	});
});
