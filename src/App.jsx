import { useState } from 'react'
import { ThreadList } from './ThreadList';
import { Header } from './header';
import './App.css'

function App() {
  return (
    <div>
      <Header/>
      <ThreadList />
     
    </div>
  );
}

export default App
