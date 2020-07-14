import React, {useState, useContext} from 'react'
import {Link} from "react-router-dom"
import HeaderLoggedin from './HeaderLoggedin'
import HeaderLoggedOut from './HeaderLoggedout'
import StateContext from '../StateContext'

function Header(props) {
  const appState = useContext(StateContext)
  const headerContent = appState.loggedIn ? <HeaderLoggedin /> : <HeaderLoggedOut />

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ComplexApp!
          </Link>
        </h4>
        {!props.staticEmpty ? headerContent : ""}
      </div>
    </header>
  )
}

export default Header
