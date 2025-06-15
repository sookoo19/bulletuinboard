import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import { ThreadList } from './ThreadList';
import { Header } from './header';
import { CreateThreads } from './CreateThreads';
import './App.css'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/threads" element={<ThreadList />} />
        <Route path="/threads/new" element={<CreateThreads />} />
      </Routes>
    </Router>
  );
}

export default App
