import './App.css'
import Calendar from './components/Calendar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Calendar />
    </DndProvider>
  );
}

export default App;
