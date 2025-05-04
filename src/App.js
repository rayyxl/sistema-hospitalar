import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/login.js';
import Cadastro from './screens/cadastro.js'
import Inicial from './screens/inicial.js'
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/form-cadastro' element={<Cadastro />}/>
        <Route path='/tela-inicial' element={<Inicial />}/>
      </Routes>
    </Router>
  );
}

export default App;
