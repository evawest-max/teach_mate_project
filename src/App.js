import './App.css';

import { createBrowserRouter,  Route, createRoutesFromElements, RouterProvider} from 'react-router-dom';
import Notfound from './components/notfound/notfound';
import HomePage from './components/homePage/homePage';
import TaskProvider from './components/context/appContext';



const router=createBrowserRouter(
  createRoutesFromElements(
      <Route path="/" element={<HomePage/>}>
        <Route path='*' element={<Notfound/>} />  
      </Route>
  )
)
function App() {
  return (
    <TaskProvider>
      <RouterProvider router={router}/> 
    </TaskProvider>      
  );
}

export default App;
