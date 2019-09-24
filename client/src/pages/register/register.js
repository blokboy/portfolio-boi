import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import SimpleReactValidator from 'simple-react-validator'
import axios from 'axios' 

// eslint-disable-next-line
import bulma from 'bulma/css/bulma.css'

export default function Register({ ...props }) {
    // eslint-disable-next-line
    const [validator, setValidator] = useState(new SimpleReactValidator({ locale: 'en' }))
    const [state, setState] = useState({
        'first_name': '',
        'last_name': '',
        'email': '',
        'phone': '',
        'password': '',
        'password_conf': ''
    })

    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(validator.allValid()) {
            const user = { 
                first_name: state.first_name,
                last_name: state.last_name,
                email: state.email,
                phone: state.phone,
                password: state.password 
            }
            //hide routes behind config <- env variables 
            const { data } = await axios.post('http://localhost:8000/API/users/register', user) 
            alert(data.message)
            if(data.token) {
                props.history.push('/login')
            } else {
                props.history.push('/register')
            }
        } else {
            validator.showMessages()
            props.history.push('/register')
        }
    }

    return (
        <section className="hero is-success is-bold is-fullheight" onClick={props.onClick}>
            <div className="hero-body">
            <div className="container">
                <h1 className="title">
                    Register 
                </h1>

                <Container maxWidth="sm">
                <div className="field">
                    <label className="label">First Name</label>
                    <div className="control">
                        <input className="input" type="text" name="first_name" onChange={handleChange('first_name')} />
                        {validator.message('first_name', state.first_name, 'required|alpha_num_dash_space')}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Last Name</label>
                    <div className="control">
                        <input className="input" type="text" name="last_name" onChange={handleChange('last_name')} />
                        {validator.message('last_name', state.last_name, 'required|alpha_num_dash_space')}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Email</label>
                    <div className="control"> 
                        <input className="input" type="email" name="email" onChange={handleChange('email')} />
                        {validator.message('email', state.email, 'required|email')}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Phone</label>
                    <div className="control"> 
                        <input className="input" type="text" name="phone" onChange={handleChange('phone')} />
                        {validator.message('phone', state.phone, 'phone')}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control"> 
                        <input className="input" type="password" name="password" onChange={handleChange('password')} />
                        {validator.message('password', state.password, 'required')}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password Confirmation</label>
                    <div className="control"> 
                        <input className="input" type="password" name="password_conf" onChange={handleChange('password_conf')} />
                        {validator.message('password_conf', state.password_conf, `required|in:${state.password}`)}
                    </div>
                </div>
                <br />
                <div className="field"> 
                    <a className="button is-rounded" href="/" onClick={(e) => handleSubmit(e)}>Register</a>
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
                       <NavLink to="/registration">Register</NavLink>
                    </li>
                    </ul>
                </div>
                </nav>
            </div>
        </section>
    )
}