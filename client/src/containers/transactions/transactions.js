import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie' 
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios' 

import bulma from 'bulma/css/bulma.css'

const Transaction = styled.div`
`

export default function Transactions({ ...props }) {
    const { setBackgroundColor, LogoutButton, logout } = props 
    const [transactions, setTransactions] = useState([])
    const [cookie, removeCookie] = useCookies()

    const getUserTransactionHistory = async () => {
        const { data } = await axios.get('http://localhost:8000/API/users/transactions', {
            headers: {
                "Authorization": cookie.jwt
            }
        })

        if(data.length > 0) {
            await setTransactions(data) 
        }
        
        console.log(data)
        return
    }

    useEffect(() => {
        getUserTransactionHistory()
    }, [])

    return(
         <section className="hero is-info is-bold is-fullheight" onClick={setBackgroundColor()}>
         <div className="hero-head">
            <LogoutButton onClick={ async (e) => {
                    e.preventDefault()
                    await removeCookie('jwt')
                    props.history.push('/')
                }}
            /> 
             <h5 style={{ 'margin-top' : '60px'}}>
                 Transaction History
                 <br />
             </h5>
         </div>
        
         <div className="hero-body" style={{ 'display' : 'block' }}>
         {transactions.length < 1 && (
            <h1 style={{ 'margin' : '0 auto' }}>No Transactions Yet!</h1>
         )}
         {transactions.length > 0 && (
            transactions.map(entry => {
               return(
                   <div style={{ 'margin' : '0 auto' , 'width' : '400px' }}>
                   <h2 style={{ 'margin' : '0 auto' }}>{entry.order_type} - {entry.created_at}</h2>
                   <br />
                   <h4 style={{ 'margin' : '0 auto' }}>{entry.ticker} - {entry.company_name}</h4>
                   <br />
                   <h5 style={{ 'margin' : '0 auto' }}>Shares: {entry.quantity} - Price: {entry.price.toFixed(2)}</h5>
                   <hr />
                   </div>
               )
            })
         )}
         </div>

         <div className="hero-foot">
             <nav className="tabs is-boxed is-fullwidth">
             <div className="container">
                 <ul>
                 <li>
                   <NavLink to="/analytics">Analytics</NavLink>
                 </li>
                 <li>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                 </li>
                 </ul>
             </div>
             </nav>
         </div>
     </section>

    )
}