import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/login.js';
import Cadastro from './screens/cadastro.js'
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/form-cadastro' element={<Cadastro />}/>
      </Routes>
    </Router>
  );
}

export default App;
