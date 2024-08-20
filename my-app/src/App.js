import { Header } from './components/Header';
import { Card } from './components/Card';
import { Footer } from './components/Footer';
import 'materialize-css/dist/css/materialize.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Edit from './Pages/Edit';

function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<Header />
				<Switch>
					<Route path='/edit/:id' component={ Edit } />
					<Route path='/' component={ Card } />
				</Switch>
				<Footer />
			</div>
		</BrowserRouter>
	);
}

export default App;