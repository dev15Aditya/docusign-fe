import './App.css'
import CreateProcess from './pages/CreateProcess'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReviewSignDoc from './pages/review-and-sign';

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<CreateProcess />} />
          <Route path="/document/status/:document_id/:unique_hash" element={<ReviewSignDoc />} />
        </Routes>
      </Router>
    );
}

export default App
