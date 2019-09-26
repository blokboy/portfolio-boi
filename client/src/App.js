import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import Landing from './pages/landing'
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './containers/dashboard'
import Transactions from './containers/transactions'
import Analytics from './containers/analytics'
import styled from 'styled-components'
import './App.css'

const LogoutButton = styled.button`
    position: absolute;
    width: 40px;
    height: 40px;
    background: red;
    margin-top: 10px;
    right: 25px;
    border-radius: 25px;
    border: 2px solid black;
    cursor: pointer;
`



function App({ ...props }) {
  const [index, setIndex] = useState(0)
  const [cookie, setCookie, removeCookie] = useCookies()

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
                LogoutButton={LogoutButton}
               />
             )}
      />
      <Route path="/transactions"
             render={ props => (
               <Transactions 
                { ...props }
                setBackgroundColor={setBackgroundColor}
                LogoutButton={LogoutButton}
                />
             )}
      />
      <Route path="/analytics" 
             render={ props => (
               <Analytics 
                { ...props }
                setBackgroundColor={setBackgroundColor}
                LogoutButton={LogoutButton}
               />
             )}
      />
    </div>
  );
}

export default App;
