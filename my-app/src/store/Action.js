// actions.js
export const SELECT_TODO = 'SELECT_TODO';

export const selectTodo = (todoId) => ({
  type: SELECT_TODO,
  payload: todoId
});