import React, {useState, useContext} from 'react'
import {Link} from 'react-router-dom'
import DispatchedContext from '../DispatchedContext'
import StateContext from '../StateContext'
import ReactTooltip from 'react-tooltip'


function HeaderLoggedin (props) {

  // const {setLoggedIn} = useContext(ExampleContext)
  // const {addFlashMessage} = useContext(ExampleContext)

  const appDispatch = useContext(DispatchedContext)
  const appState = useContext(StateContext)



  function HandleLogout () {
    appDispatch({type: "flashMessages", value: "You have successfully logged out"})
    appDispatch({type: "logout"})
  }

  function handleSearchIcon(e){
    e.preventDefault();
    appDispatch({type: 'OpenSearch' })
  }

  function handleChat(e){
    e.preventDefault();
    appDispatch({type: 'toggleChat'})
  }

    
        return (
            <div className="flex-row my-3 my-md-0">
            <a data-for="search" data-tip="Search" onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
              <i  className="fas fa-search"></i>
            </a>
            <ReactTooltip place="bottom" id="search" className="custom-tooltip"/>
            {" "}{""}
            <a onClick={handleChat} data-for="chat" data-tip="Chat" className={"mr-2 header-chat-icon " + ( appState.unreadChatCount ? "text-danger" : " text-white" )  }>
              <i className="fas fa-comment"></i>
             { appState.unreadChatCount ?  <span className="chat-count-badge text-white"> {appState.unreadChatCount < 10 ? appState.unreadChatCount: "9+"} </span> : "" }
            </a>
            <ReactTooltip place="bottom" id="chat" className="custom-tooltip"/>
            
            <Link data-for="avatar" data-tip="avatar" to={`/profile/${appState.user.username}`} className="mr-2">
              <img className="small-header-avatar" src={ appState.user.avatar } />
            </Link>
            <ReactTooltip place="bottom" id="avatar" className="custom-tooltip"/>
            <Link className="btn btn-sm btn-success mr-2" to="/create-post">
              Create Post
            </Link>
            <button onClick={HandleLogout} className="btn btn-sm btn-secondary ">
              Sign Out
            </button>
          </div>
        );
   
}

export default HeaderLoggedin
