import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { NavLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import ZoomOutMap from '@material-ui/icons/ZoomOutMap'
import TrendingUp from '@material-ui/icons/TrendingUp'
import TrendingDown from '@material-ui/icons/TrendingDown'

import axios from 'axios'

// eslint-disable-next-line
import bulma from 'bulma/css/bulma.css'


const useStyles = makeStyles(theme => ({
    grow: {
      flexGrow: 1,
    },
    icon: {
      display: 'flex',
      width: '40px',
      height: '40px',
      alignSelf: 'flex-end',
      cursor: 'pointer'
    }, 
    input: {

    }
} ))
export default function OrderForm({ ...props }) {
    const classes = useStyles()
    const [cookie, setCookie] = useCookies()
    const { stockData, setBackgroundColor, setOpen } = props 
    const [order, setOrder] = useState({
        quantity: '',
        company_name: `${stockData.companyName}`,
        ticker: `${stockData.symbol}`,
        price: `${stockData.iexRealtimePrice.toFixed(2)}`,
        order_type: ''
    })

    const handlePurchase = async (e) => {
        const newOrder = { ...order, order_type: 'B' }
        const { data } = await axios.post('http://localhost:8000/API/stocks/purchase', newOrder, {
            headers: {
                "Authorization" : cookie.jwt
            }
        })
        if(data.order) {
            alert(data.message)
        } else {
            alert('There was an issue submitting the order!')
        }
    }

    const handleSale = async (e) => {
        e.preventDefault()
        const newOrder = { ...order, order_type: 'S' }
        const { data } = await axios.get('http://localhost:8000/API/users/analytics', {
            headers: {
                "Authorization": cookie.jwt
            }
        })

        if(data) {
            if(data[order.ticker] < newOrder.quantity) {
                alert("You're trying to sell more shares than you own!")
            } else {
                const success = await axios.post('http://localhost:8000/API/stocks/sell', newOrder, {
                    headers: {
                        "Authorization" : cookie.jwt
                    }
                })
                if(success) {
                    alert(success.data.message)
                } else {
                    alert('There was an error processing your sell order.')
                }
            }
        }
    }

    const handleChange = name => e => {
        setOrder({ ...order, [name]: e.target.value })
        console.log(stockData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(order)
    }

    return (
        <section className="hero is-light is-bold" onClick={props.onClick}>
            <ZoomOutMap 
                className={classes.icon}
                onClick={() => {
                    setOpen(false) 
                    window.location.reload()
                }}
            />
            <div className="hero-body">
            <div className="container">
                <Container maxWidth="sm">
                <h3 className="subtitle">
                    { stockData.symbol } - { stockData.companyName } { stockData.changePercent > 0 ? <TrendingUp className={classes.icon} style={{ color: 'green' }}/> : <TrendingDown className={classes.icon} style={{ color: 'red' }}/> } (${stockData.latestPrice.toLocaleString(navigator.language, { minimumFractionDigits: 2})}) ({(stockData.changePercent * 100).toLocaleString(navigator.language, { minimumFractionDigits: 3 })}%)
                </h3>

                <div className="field">
                    <label className="label">Data</label>
                    <div className="control">
                        <p>Market Cap: ${stockData.marketCap.toLocaleString(navigator.language, { minimumFractionDigits: 2})}</p>
                    </div>
                    <div className="control">
                        <p>52 Week High: ${stockData.week52High.toFixed(2)}</p>
                    </div>
                    <div className="control">
                        <p>52 Week Low: ${stockData.week52Low.toFixed(2)}</p>
                    </div>
                    <div className="control">
                        <p style={{ color: stockData.ytdChange > 0 ? 'green' : 'red' }}>YTD (%): {stockData.ytdChange.toLocaleString(navigator.language, { minimumFractionDigits: 3 })}</p>
                    </div>
                    <div className="control">
                        <p>Last Trade: {stockData.latestTime}</p>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Shares</label>
                    <div className="control">
                        <input className="input" type="text" name="shares" onChange={handleChange('quantity')} style={{ width: '17%' }}/> {order.quantity ? (Number(order.quantity) * stockData.latestPrice).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                    </div>
                </div>
                </Container>
            </div>
            </div>

            <div className="hero-foot">
                <nav className="tabs is-boxed is-fullwidth">
                <div className="container">
                    <ul>
                    <li>
                      <NavLink to="#" onMouseOver={stockData.changePercent > 0 ? setBackgroundColor(4) : setBackgroundColor(0)} onClick={(e) => handlePurchase(e)}>Buy</NavLink>
                    </li>
                    <li>
                       <NavLink to="#" onMouseOver={stockData.changePercent > 0 ? setBackgroundColor(0) : setBackgroundColor(4)} onClick={(e) => handleSale(e)}>Sell</NavLink>
                    </li>
                    </ul>
                </div>
                </nav>
            </div>
        </section>
    )
}