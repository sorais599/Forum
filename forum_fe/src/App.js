// import logo from './logo.svg';
import './App.css';
import Login from './Page/Login';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Register from './Page/Register';
import Topic from './Page/Topic';
function App() {
  return (
    
    <Router>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/home" element={<Topic/>}></Route>
          <Route path="/changepass"></Route>
          <Route path="/pinfo"></Route>
          <Route paht="/post/"></Route>
          <Route path="/posts"></Route>
          <Route path="/postTopic"></Route>
          <Route paht="/manageacc"></Route>
          <Route paht="/notify"></Route>
          <Route path="/approve"></Route>
        </Routes>
    </Router>
  );
}

export default App;
