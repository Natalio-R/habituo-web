import React from 'react'
import Logo from  "../assets/images/habituo-logo.svg"

const Loading = () => {
  return (
    <div id="loading">
        <img src={Logo} width={200} height alt="Habituo App" />
        <h1>Estamos en proceso</h1>
        <p>Solo tienes que esperar para poder ver lo que estamos creando.</p>
        <div className='gif'></div>
    </div>
  )
}

export default Loading