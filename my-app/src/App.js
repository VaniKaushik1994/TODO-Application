import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Header } from './components/Header';
import 'materialize-css/dist/css/materialize.min.css';
import { Footer } from './components/Footer';
import Edit from './Pages/Edit';
import { Card } from './components/Card';
import { connect  } from 'react-redux';
import { Provider } from 'react-redux';
import store from './store/store';
import { selectTodo } from './store/Action';

const mapStateToProps = (state) => ({
    selectedTodo: state
  });

const mapDispatchToProps = dispatch => ({
	selectTodo: todoId => dispatch(selectTodo(todoId))
});

const StateHeader =  connect(mapStateToProps)(Header)
const StateEdit = connect(mapStateToProps, mapDispatchToProps)(Edit)

class App extends React.Component {
  render() {
	console.log(this.props);
    return (
      <BrowserRouter>
		<Provider store={store}>
			<div className="App">
				<StateHeader />
				<Switch>
					<Route path='/edit/:id' component={StateEdit} />
					<Route path='/' component={Card} />
				</Switch>
				<Footer />
				</div>
		</Provider>
      </BrowserRouter>
    );
  }
}

export default App;