import { Sidebar } from './components/sidebar';
import { TableView } from './components/table-view';
import { SqlStudio } from './components/sql-studio';

export const App = () => {
	return (
		<div className='drawer h-screen w-full'>
			<input id='sql-studio-drawer' type='checkbox' className='drawer-toggle' />
			<div className='drawer-content flex flex-row h-screen overflow-hidden'>
				<Sidebar />
				<main className='flex-1 overflow-auto p-4'>
					{/* Header / Top Bar */}
					<TableView />
				</main>
			</div>
			<div className='drawer-side z-50'>
				<label
					htmlFor='sql-studio-drawer'
					aria-label='close sidebar'
					className='drawer-overlay'></label>
				<div className='menu p-4 w-[90vw] h-full max-h-screen bg-base-100 text-base-content flex flex-col overflow-hidden'>
					<SqlStudio />
				</div>
			</div>
		</div>
	);
};

export default App;
