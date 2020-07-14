import React, {useEffect, useContext} from 'react'
import Page from './Page'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchedContext'
import {useImmer} from 'use-immer'
import LoadingDotsIcon from './LoadingDotIcon'
import Axios from 'axios'
import {Link} from 'react-router-dom'
import Post from './Post'


function home() {

    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    const [state, setState] = useImmer({
        isLoading: true,
        feed: []
    })

   
    
    useEffect( () => {
        async function fetchData() {
          try {
            const response = await Axios.post('/getHomeFeed', {token: appState.user.token})
            console.log(response.data)
             setState(draft => {
               draft.isLoading = false
               draft.feed = response.data
             })
          } catch (e) {
              console.log('There was a problem')
          }
        } 
        fetchData()
      } , [])


      if( state.isLoading ){
        return <LoadingDotsIcon/>
      }

   
    return (
        <Page title="Your Feed">
        
        {state.feed.length > 0 && (
            <>
                <h2>The Latest from those you follow</h2>
                <br/>
                <div className="list-group">
                {state.feed.map( post => {
                   return <Post post={post} key={post._id}/>
                }  )}
                </div>
            </>
        )}
            {state.feed.length == 0 && (
             <>
                <h2 className="text-center">Hello <strong> {appState.user.username} </strong>, your feed is empty.</h2>
      <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them!!</p>
      </>
            )}
         
        
        </Page>
    )
}

export default home
