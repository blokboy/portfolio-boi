import React from 'react'
import { NavLink } from 'react-router-dom'

// eslint-disable-next-line
import bulma from 'bulma/css/bulma.css'

export default function Landing({ ...props }) {
    return (
        <section className="hero is-success is-bold is-fullheight" onClick={ props.onClick }>
            <div className="hero-body">
            <div className="container">
                <h1 className="title">
                    Portfolio Boi
                </h1>
                <h2 className="subtitle">
                    A game for traders and investors
                </h2>
            </div>
            </div>

            <div className="hero-foot">
                <nav className="tabs is-boxed is-fullwidth">
                <div className="container">
                    <ul>
                    <li>
                      <NavLink to="/login">Login</NavLink>
                    </li>
                    <li>
                       <NavLink to="/register">Register</NavLink>
                    </li>
                    </ul>
                </div>
                </nav>
            </div>
        </section>
    )
}