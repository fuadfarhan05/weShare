import './App.css';
import {Auth} from "./components/auth";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Room from "./pages/Room";
import RoomPage from "./pages/RoomPage";


function App(){
 
  
  return ( <div className = "App">

    <h1>weShare</h1>



    <Router>
      {/* Global Navigation (optional) */}
      <header>
        <nav>
          <Link to="/">Sign-In/Out</Link>
          <Link to="/chatroom">TaskRoom</Link>
          
        </nav>
      </header>
      
      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<Auth/>} />
        <Route path="/chatroom" element={<Room />} />
        <Route path="/rooms/:roomId" element={<RoomPage />} />

        {/* Optional 404 Page */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>

  </div>
  );
}

export default App;
