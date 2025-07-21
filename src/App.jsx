import './App.css'
import Calendar from './components/Calendar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EventProvider } from './components/event-context';

function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-white via-blue-100 to-purple-100 flex items-center justify-center">
      <EventProvider>
        <DndProvider backend={HTML5Backend}>
          <div className="h-full w-full bg-white/70 backdrop-blur-md rounded-none shadow-2xl border border-blue-100 flex items-center justify-center">
            <Calendar />
          </div>
        </DndProvider>
      </EventProvider>
    </div>
  );
}

export default App;
