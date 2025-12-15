import { Sidebar } from './components/sidebar';
import { TableView } from './components/table-view';

export const App = () => {
	return (
		<>
			<Sidebar />
			<main className='ml-65'>
				<TableView />
			</main>
		</>
	);
};

export default App;
