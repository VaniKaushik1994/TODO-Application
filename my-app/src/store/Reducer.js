// reducers.js
const initialState = {
  selectedTodoId: null
};

const todoReducer = (state = initialState, action) => {
  console.log('Reducer: ', action);
  switch (action.type) {
    case 'SELECT_TODO':
      return { ...state, selectedTodoId: action.payload };
    default:
      return state;
  }
};

export default todoReducer;