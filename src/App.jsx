import './App.css'
import Calendar from './components/Calendar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-100 to-purple-100 flex flex-col items-center justify-center py-8">
      <DndProvider backend={HTML5Backend}>
        <div className="w-full max-w-5xl bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-6 sm:p-10">
          <Calendar />
        </div>
      </DndProvider>
    </div>
  );
}

export default App;
