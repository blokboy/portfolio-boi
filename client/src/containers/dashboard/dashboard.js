import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import Navbar from '../../components/navbar'
import axios from 'axios'

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

// eslint-disable-next-line
import bulma from 'bulma/css/bulma.css'


export default function Dashboard({ ...props }) {
    const [balance, setBalance] = useState(0)
    const [cookie, setCookie, removeCookie] = useCookies()
    const { setBackgroundColor } = props

    const getUserBalance = async () => {
        const { data } = await axios.get('http://localhost:8000/API/users/dashboard', {
            headers: {
                "Authorization": cookie.jwt
            }
        })

        if(data) {
           await setBalance(data.user.balance)
        }
    }

    const logout = async (e) => {
        e.preventDefault()
        await removeCookie('jwt')
        props.history.push('/')
    }

    useEffect(() => {
        getUserBalance()
    }, [])

    return (
        <section className="hero is-info is-bold is-fullheight" onClick={setBackgroundColor()}>
            <div className="hero-head">
                <LogoutButton onClick={(e) => logout(e)} />
                <h5 style={{ 'margin-top' : '60px'}}>
                    Portfolio Boi
                    <br />
                    ${balance.toFixed(2)}
                </h5>
            </div>
           
            <div className="hero-body">
                <Navbar 
                    setBackgroundColor={setBackgroundColor}
                />
            </div>

            <div className="hero-foot">
                <nav className="tabs is-boxed is-fullwidth">
                <div className="container">
                    <ul>
                    <li>
                      <NavLink to="/analytics">Analytics</NavLink>
                    </li>
                    <li>
                       <NavLink to="/transactions">Transactions</NavLink>
                    </li>
                    </ul>
                </div>
                </nav>
            </div>
        </section>
    )
}