const Comment = require('./comment'); // Assuming comment.js is in the same directory
const fs = require('fs').promises; // Using promises for cleaner async/await syntax
// jest.mock('../helper/logger', () => ({ Logger: jest.fn() })); // Mock the logger for testing purposes

const logger = require('../helper/logger').Logger;

const mockLogger = {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn()
};

jest.mock(logger, () => mockLogger); // Mock the logger for isolation

// jest.mock('fs');

const MAX_GET_TIME = 9999999999999;

function createMockData(comments = []) {
    return {
        rev: 0,
        id_count: 0,
        comments
    };
}

function createMockComment(comment = '', username = 'user1') {
    return {
        comment,
        id: 'commentId',
        date: new Date(),
        commentor: username,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

test('Comment.getZeros returns correct zeros', () => {
    const comment = new Comment();
    expect(comment.getZeros({ lastIdCount: 0 })).toBe('00');
    expect(comment.getZeros({ lastIdCount: 9 })).toBe('00');
    expect(comment.getZeros({ lastIdCount: 10 })).toBe('0');
    expect(comment.getZeros({ lastIdCount: 99 })).toBe('0');
    expect(comment.getZeros({ lastIdCount: 100 })).toBe('');
});

test('Comment.getDate returns correct time', () => {
    const comment = new Comment();
    const now = new Date();
    const expectedTime = MAX_GET_TIME - now.getTime();
    expect(comment.getDate(now)).toBe(expectedTime);
});

test('Comment.generateId generates correct ID', () => {
    const comment = new Comment();
    expect(comment.generateId({ lastIdCount: 0 })).toBe('Comment001');
    expect(comment.generateId({ lastIdCount: 9 })).toBe('Comment00'); // Using emoji for 10
    expect(comment.generateId({ lastIdCount: 10 })).toBe('Comment011');
});

test('Comment.generateId handles invalid input', () => {
    const comment = new Comment();
    expect(comment.generateId({ lastIdCount: 'abc' })).toBe('');
    expect(comment.generateId({})).toBe('');
});

test('Comment.read reads file successfully', async () => {
    const comment = new Comment();
    const mockData = createMockData();
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    const callback = jest.fn();
    await comment.read({ path: 'path/to/file' }, callback);
    expect(callback).toHaveBeenCalledWith({ data: mockData });
});

test('Comment.read handles errors', async () => {
    const comment = new Comment();
    const error = new Error('Read error');
    fs.readFile.mockRejectedValue(error);
    const callback = jest.fn();
    await comment.read({ path: 'path/to/file' }, callback);
    expect(callback).toHaveBeenCalledWith({ data: { rev: 0, id_count: 0, comments: [] } });
});

test('Comment.write writes file successfully', async () => {
    const comment = new Comment();
    const comments = [createMockComment()];
    fs.writeFile.mockResolvedValue();
    const callback = jest.fn();
    await comment.write({ path: 'path/to/file', comments }, callback);
    expect(callback).toHaveBeenCalledWith({ comments });
});

test('Comment.write handles errors', async () => {
  const comment = new Comment();
  const comments = [createMockComment()];
  const error = new Error('Write error');
  fs.writeFile.mockRejectedValue(error);
  const callback = jest.fn();
  await comment.write({ path: 'path/to/file', comments }, callback);
  expect(callback).toHaveBeenCalledWith({ message: 'Facing error while updating comment!!!' });
});

test('Comment.processComment processes comment correctly', () => {
    const comment = new Comment();
    const data = createMockData();
    const username = 'user1';
    const processedComment = comment.processComment({ comment: 'This is a comment', data, username, action: 'insert' });
    expect(processedComment).toEqual({
      comment: 'This is a comment',
      id: expect.any(String), // Don't check for exact ID, just presence
      date: expect.any(Number), // Don't check for exact time, just presence
      commentor: username,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });
  
  test('Comment.processComment handles missing data', () => {
    const comment = new Comment();
    expect(comment.processComment({})).toBeFalsy();
  });

  
  test('Comment.insert inserts comment successfully', async () => {
    const comment = new Comment();
    const mockData = createMockData();
    const newComment = createMockComment('New Comment');
    const username = 'user1';
    const todoId = 'todo123';
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    comment.write = jest.fn().mockResolvedValue();
    const callback = jest.fn();
    await comment.insert({ path: 'path/to/file', comment: newComment, username, todoId }, callback);
    expect(comment.read).toHaveBeenCalled();
    expect(comment.write).toHaveBeenCalledWith({ path: 'path/to/file', comments: expect.any(Array), action: 'insert' });
    expect(callback).toHaveBeenCalledWith({ comments: expect.any(Array) }); // Check for updated comments array
  });
  
  test('Comment.insert handles errors', async () => {
    const comment = new Comment();
    const callback = jest.fn();
    await comment.insert({}, callback);
    expect(callback).toHaveBeenCalledWith({ err: true });
  });

  test('Comment.update updates comment successfully', async () => {
    const comment = new Comment();
    // ... (set up mock data and comment)
    const mockData = createMockData();
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    comment.write = jest.fn().mockResolvedValue();
    const callback = jest.fn();
    await comment.update({ path: 'path/to/file', comment, username: 'Vani', todoId: 143 }, callback);
    // ... (assertions similar to insert)
    expect(comment.read).toHaveBeenCalled();
    expect(comment.write).toHaveBeenCalledWith({ path: 'path/to/file', comments: expect.any(Array), action: 'insert' });
    expect(callback).toHaveBeenCalledWith({ comments: expect.any(Array) }); // Check for updated comments array
  });
  
  test('Comment.update handles errors', async () => {
    const comment = new Comment();
    const callback = jest.fn();
    await comment.update({}, callback);
    expect(callback).toHaveBeenCalledWith({ err: 'Something went wrong!!' });
  });

  test('Comment.delete deletes comment successfully', async () => {
  const comment = new Comment();
  // ... (set up mock data and comment)
  const mockData = createMockData();
  fs.readFile.mockResolvedValue(JSON.stringify(mockData));
  comment.write = jest.fn().mockResolvedValue();
  const callback = jest.fn();
  await comment.delete({ path: 'path/to/file', id: comment.id, username: 'Vani', todoId: 123}, callback);
  expect(callback).toHaveBeenCalledWith({ comments: expect.any(Array) }); // Check for updated comments array without deleted comment
});

test('Comment.delete handles errors', async () => {
  const comment = new Comment();
  const callback = jest.fn();
  await comment.delete({}, callback);
  expect(callback).toHaveBeenCalledWith({ err: 'Something went wrong!!' });
});


  
  