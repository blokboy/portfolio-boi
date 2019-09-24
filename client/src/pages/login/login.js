import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import SimpleReactValidator from 'simple-react-validator'
import Container from '@material-ui/core/Container'
import axios from 'axios'

// eslint-disable-next-line
import bulma from 'bulma/css/bulma.css'

export default function Login({ ...props }) {
    const [cookie, setCookie, removeCookie] = useCookies()
      // eslint-disable-next-line
    const [validator, setValidator] = useState(new SimpleReactValidator({ locale: 'en' }))
    const [state, setState] = useState({
        'email' : '',
        'password': ''
    })
    console.log('cookie: ', cookie)
    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(validator.allValid()) {
            const user = { ...state }
            const { data } = await axios.post('http://localhost:8000/API/users/login', user)
            alert(data.message)
            if(data.token) {
                // Set Cookie here and store the jwt here and redirect to the dashboard
                if(cookie.jwt) {
                    await removeCookie('jwt')
                } 
                // Make sure the cookie is accessible from any page after it's set
                await setCookie('jwt', data.token, { path: '/' })
                props.history.push('/dashboard')
            } else {
                props.history.push('/login')
            }
        } else {
            validator.showMessages()
            props.history.push('/login')
        }
    }

    return (
        <section className="hero is-success is-bold is-fullheight" onClick={props.onClick}>
            <div className="hero-body">
            <div className="container">
                <h1 className="title">
                    Login 
                </h1>

                <Container maxWidth="sm">
                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input className="input" type="email" name="email" onChange={handleChange('email')} />
                        {validator.message('email', state.email, 'required|email')}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control"> 
                        <input className="input" type="password" name="password" onChange={handleChange('password')} />
                        {validator.message('password', state.password, 'required')}
                    </div>
                </div>
                <br />
                <div className="field"> 
                    <a className="button is-rounded" href="/" onClick={(e) => handleSubmit(e)}>Login</a>
                </div>
                </Container>
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