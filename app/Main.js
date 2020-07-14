import React, {useState, useReducer, useEffect, useContext, Suspense} from 'react'
import {useImmerReducer} from 'use-immer'
import ReactDOM from 'react-dom'
import {BrowserRouter, Switch, Route} from 'react-r   outer-dom'
import {CSSTransition} from 'react-transition-group'
import Axios from 'axios'
Axios.defaults.baseURL = process.env.BACKENDURL || 'https://backend-api-hd.herokuapp.com'

// My Components
import Header from './components/Header'
import Footer from './components/Footer'
import HomeGuest from './components/HomeGuest'
import About from './components/About'
import Terms from './components/Terms'
import Home from './components/Home'
const CreatePost = React.lazy(()=> import('./components/CreatePost'))
const ViewSinglePost = React.lazy(()=> import('./components/ViewSinglePost'))
import Profile from './components/Profile'
import FlashMessages from './components/FlashMessages'
import NotFound from './components/NotFound'
const Search = React.lazy(()=> import('./components/Search'))


// useContext location
import StateContext from './StateContext'
import DispatchedContext from './DispatchedContext'
import EditPost from './components/EditPost'
const Chat = React.lazy(()=> import('./components/Chat'))
import LoadingDotIcon from './components/LoadingDotIcon'


function Main(){

    const appDispatch = useContext[DispatchedContext]

    const initialState = {
        loggedIn: Boolean(localStorage.getItem('complexappToken')),
        flashMessages: [],
        user: {
            token: localStorage.getItem('complexappToken'),
            username: localStorage.getItem('complexappUsername'),
            avatar: localStorage.getItem('complexappAvatar')
        },
        isSearchOpen: false,
        isChatOpen: false,
        unreadChatCount: 0
    }
    function ourReducer(draft, action){
        switch (action.type) {
            case 'login':
                draft.loggedIn = true
                draft.user = action.data
                return
            case 'logout':
               draft.loggedIn = false
               return
            case 'flashMessages':
                draft.flashMessages.push(action.value)
                return
            case 'OpenSearch':
                draft.isSearchOpen = true
                return
            case 'closeSearch':
                draft.isSearchOpen = false
                return
            case "toggleChat":
                draft.isChatOpen = !draft.isChatOpen
                return
            case "closeChat":
                draft.isChatOpen = false
                return
            case "incrementUnreadChatCount":
                draft.unreadChatCount++
                return
            case "clearUnreadChatCount":
                draft.unreadChatCount = 0
                return

        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("complexappToken" , state.user.token)
            localStorage.setItem("complexappUsername" , state.user.username)
            localStorage.setItem("complexappAvatar" , state.user.avatar)
        } else {
            localStorage.removeItem("complexappToken")
            localStorage.removeItem("complexappUsername")
            localStorage.removeItem("complexappAvatar")
        }
    } , [state.loggedIn])

    //check token expiration
    useEffect(()=> {
        if (state.loggedIn) {
           
            // send axios request here
            const ourRequest = Axios.CancelToken.source()
           async function fetchResults () {
                try {
                   const response = await Axios.post('/checkToken', {token: state.user.token}, {cancelToken: ourRequest.token})
                    // console.log(response.data)
                   if(!response.data) {
                    dispatch({type: "logout"})
                    dispatch({type: "flashMessages", value: "your session has expired. Please log in again"})
                    
                   }
                } catch (e) {
                    console.log('There was a problem')
                  
                }
            }
            fetchResults()
            return () => ourRequest.cancel()
        }
    },[])
   
   
    return (
        <StateContext.Provider value={state}> 
        <DispatchedContext.Provider value={dispatch}>
        <BrowserRouter>
        <FlashMessages messages={state.flashMessages}/>
        <Header />
        <Suspense fallback={<LoadingDotIcon />}>
            <Switch >

                <Route path="/profile/:username">
                    <Profile/>
                </Route>

                <Route path="/" exact>
                  { state.loggedIn ? <Home/> : <HomeGuest/> }  
                </Route>

                <Route path="/about-us" exact>
                    <About />
                </Route>

                <Route path="/post/:id" exact>
                    <ViewSinglePost />
                </Route>

                <Route path="/post/:id/edit" exact>
                    <EditPost/>
                </Route>

                <Route path="/create-post" exact>
                    { state.loggedIn ? <CreatePost/> : <HomeGuest/> }  
                  
                </Route>

                <Route path="/terms" exact>
                    <Terms />
                </Route>

                <Route>
                    <NotFound/>
                </Route>

            </Switch>
            </Suspense>
            <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
               <div className="search-overlay" >
                   <Suspense fallback="">
                       <Search/>
                   </Suspense>
               </div>
            </CSSTransition>
        <Suspense fallback="">
            {state.loggedIn && <Chat/> }
        </Suspense>
        <Footer />
        </BrowserRouter>
        </DispatchedContext.Provider>
        </StateContext.Provider>
    )
}

ReactDOM.render(<Main />, document.getElementById('app'));

if(module.hot)
{
    module.hot.accept()
}