import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThreadList } from './ThreadList';
import { Header } from './header';
import { CreateThreads } from './CreateThreads';
import { PostList } from './PostList';
import './App.css'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/threads" element={<ThreadList />} />
        <Route path="/threads/new" element={<CreateThreads />} />
        <Route path="/threads/:thread_id" element={<PostList />} />
      </Routes>
    </Router>
  );
}

export default App
