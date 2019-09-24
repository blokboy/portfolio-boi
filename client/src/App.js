import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import Landing from './pages/landing'
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './containers/dashboard'
import Transactions from './containers/transactions'
import './App.css'



function App() {
  const [index, setIndex] = useState(0)

  const setBackgroundColor = choice => (e) => {
    e.preventDefault()
    const bulmaColors = ['is-success', 'is-info', 'is-primary', 'is-warning', 'is-danger', 'is-light', 'is-dark']
    const background = document.querySelector('section')

    if(index >= bulmaColors.length - 1) {
        setIndex(0)
    } else {
        setIndex(index + 1)
    }
    if(choice >= 0 && choice <= bulmaColors.length - 1) {
      background.className = `hero ${bulmaColors[choice]} is-bold is-fullheight`
    } else {
      background.className = `hero ${bulmaColors[index]} is-bold is-fullheight`
    }
    
  }

  return (
    <div className="App">
      <Route exact path="/" 
             render={ props => (
               <Landing 
                { ...props }
                onClick={(e) => setBackgroundColor(e)}
               />
             )}
      />
      <Route path="/login" 
             render={ props => (
               <Login 
                { ...props }
                onClick={(e) => setBackgroundColor(e)}
               />
             )}
      />
      <Route path="/register" 
             render={ props => (
               <Register 
                { ...props }
                onClick={(e) => setBackgroundColor(e)}
               />
             )}
      />
      <Route path="/dashboard"
             render={ props => (
               <Dashboard
                { ...props }
                setBackgroundColor={setBackgroundColor}
               />
             )}
      />
      <Route path="/transactions"
             render={ props => (
               <Transactions 
                { ...props }
                setBackgroundColor={setBackgroundColor}
                />
             )}
      />
    </div>
  );
}

export default App;
