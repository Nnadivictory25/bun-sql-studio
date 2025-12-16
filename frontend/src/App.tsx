import { Sidebar } from './components/sidebar';
import { TableView } from './components/table-view';
import { SqlStudio } from './components/sql-studio';

export const App = () => {
	return (
		<div className='drawer h-screen w-full bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30'>
			<input id='sql-studio-drawer' type='checkbox' className='drawer-toggle' />
			<div className='drawer-content flex flex-row h-screen overflow-hidden bg-slate-950'>
				<Sidebar />
				<main className='flex-1 overflow-auto p-0 bg-slate-950 flex flex-col'>
					{/* Header / Top Bar area could go here if needed, or inside TableView */}
					<div className='flex-1 min-h-0 bg-slate-950 p-4'>
						<TableView />
					</div>
				</main>
			</div>
			<div className='drawer-side z-50'>
				<label
					htmlFor='sql-studio-drawer'
					aria-label='close sidebar'
					className='drawer-overlay bg-black/60'></label>
				<div className='menu p-0 w-[90vw] h-full max-h-screen bg-slate-900 text-slate-300 flex flex-col overflow-hidden border-l border-slate-700 shadow-2xl shadow-black'>
					<div className='h-full flex flex-col p-4 bg-slate-900'>
						<SqlStudio />
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
