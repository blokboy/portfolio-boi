import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from '@material-ui/core/Modal'
import OrderForm from '../../containers/order_form'
import axios from 'axios'

const SearchBar = styled.input`
    background-color: white;
    width: 375px;
    height: 45px;
    border: 2px solid black;
    border-radius: 25px;
    margin: 0 auto;
    cursor: pointer;
    text-align: center;
    font-family: PokemonGB;
    outline: none;
`

const SearchButton = styled.button`
    position: absolute;
    width: 100px;
    height: 30px;
    background: pink;
    border: 2px solid black;
    border-radius: 25px;
    right: 37.5%
    cursor: pointer;
    font-family: PokemonGB;
    outline: none;
`

export default function Navbar({ ...props }) {
    const { setBackgroundColor } = props 
    const [search, setSearch] = useState('')
    const [stock, setStock] = useState({})
    const [open, setOpen] = useState(false)

    const isModalOpen = Boolean(open)

    const handleChange = async e => {
        e.preventDefault()
        await setSearch(e.target.value)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const { data } = await axios.get(`http://localhost:8000/API/stocks/${search.toLocaleLowerCase()}`)
        if(data) {
            await setStock(data)
            await setOpen(true)
        } else {
            alert('There was no stock found at that ticker symbol!')
        }        
    }

    return(
        <>
       <SearchBar onChange={(e) => handleChange(e)} />
       <SearchButton onClick={(e) => handleSubmit(e)}>
            Search
        </SearchButton>
        
        <Modal open={open} style={{ 'width' : '600px', 'height': '600px' , 'margin' : '0 auto', 'margin-top' : '50px' }}>
            <OrderForm 
                { ...props }
                stockData={stock}
                setBackgroundColor={setBackgroundColor}
                setOpen={setOpen}
            />
        </Modal>
        </>

        
    )
}