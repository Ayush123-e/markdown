import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

const Home = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Welcome to MERN App</h1>
    <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
      Start building your application.
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
