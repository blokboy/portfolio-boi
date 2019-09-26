import React, { useState, useEffect } from 'react' 
import { NavLink } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import axios from 'axios'


export default function Analytics({ ...props }) {
    const { setBackgroundColor, LogoutButton, logout } = props 
    const [holdings, setHoldings] = useState([])
    const [cookie, removeCookie] = useCookies()
    const [consolidated, setConsolidated] = useState([])
    const [totalShares, setTotalShares] = useState(0)
    const [totalValue, setTotalValue] = useState(0)

    const getUserHoldings = async () => {
        const { data } = await axios.get('http://localhost:8000/API/users/analytics', {
            headers: {
                "Authorization" : cookie.jwt
            }
        })

        if(data) {
            let holdingData = []
            for(const key of Object.keys(data)) {
                let obj = {
                    name : key,
                    value : data[key]
                }
                holdingData = [ ...holdingData, obj ]
            }
            await setHoldings(holdingData)
            await consolidatePortfolio(data)
        }
    }

    const consolidatePortfolio = async (holdings) => {
        let consolidatedPortfolio = []
        for(const key of Object.keys(holdings)) {
            let { data } = await axios.get(`http://localhost:8000/API/stocks/${key.toLocaleLowerCase()}`)
            consolidatedPortfolio = [
                ...consolidatedPortfolio, 
                {
                    name : key,
                    value : Number((holdings[key] * data.latestPrice).toFixed(2))
                }
            ]
        }

        await setConsolidated(consolidatedPortfolio)
    }

    const getPortfolioValueAllocation = () => {
        let sum = 0
        for(const entry of consolidated) {
            sum += entry.value // .reduce was throwing NaN in certain cases need to come fix later
        }
        return sum
    }

    const getPortfolioShareAllocation = () => {
        let sum = 0
        for(const entry of holdings) {
            sum += entry.value // .reduce was throwing NaN in certain cases need to come fix later
        }
        return sum
    }

    useEffect(() => {
        getUserHoldings()
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
                Portfolio Analytics
                <br />
            </h5>
        </div>
       
        <div className="hero-body">
        {holdings.length > 0 && (
            <div style={{ 'margin': '0 auto' }}>
                <h5>Portfolio Breakdown</h5>
                <ResponsiveContainer height={200} width="90%">
                    <PieChart>
                        <Pie
                            data={holdings}
                            dataKey='value'
                            nameKey='name'
                            innerRadius={35}
                            outerRadius={50}
                            startAngle={90}
                            endAngle={450}
                        >
                            {holdings.map((_ , index) => (
                                <Cell 
                                    key={holdings[index].name} 
                                    fill="#000000"
                                    alt={holdings[index].name}
                                />     
                            ))}
                        </Pie>
                        <Pie
                            data={consolidated}
                            dataKey='value'
                            nameKey='name'
                            innerRadius={50}
                            outerRadius={65}
                            startAngle={90}
                            endAngle={450}
                        >
                            {consolidated.map((_, index) => (
                                <Cell 
                                    key={consolidated[index].name}
                                    fill="#9732FF"
                                    alt={holdings[index.name]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <hr />
                <h6>
                    Portfolio Allocation By Shares:
                    {
                        holdings.map(entry => (
                        <p>{entry.name} - {entry.value} - {holdings.length < 2 ? 100 : ((entry.value / getPortfolioShareAllocation() * 100).toFixed(1))}%</p>
                        ))
                    }
                </h6>
                <br />
                <h6>
                    Portfolio Allocation By Value:
                    {
                        consolidated.map(entry => (
                        <p>{entry.name} - {entry.value.toFixed(2)} - {consolidated.length < 2 ? 100 : ((entry.value / getPortfolioValueAllocation() * 100).toFixed(1))}%</p>
                        ))
                    }
                </h6>
            </div>
        )}

        {holdings.length < 1 && (
            <h5 style={{ 'margin' : '0 auto' }}>No Holdings Yet!</h5>
        )}
        
        </div>

        <div className="hero-foot">
            <nav className="tabs is-boxed is-fullwidth">
            <div className="container">
                <ul>
                <li>
                  <NavLink to="/dashboard">Dashboard</NavLink>
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