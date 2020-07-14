const { createFactory } = require("react");


import React, {useEffect, useState, useContext} from 'react'
import Page from './Page'
import { useParams, Link, withRouter } from 'react-router-dom'
import Axios from 'axios'
import ReactMarkdown from 'react-markdown'
import ReactTooltip from 'react-tooltip'
import LoadingDotIcon from './LoadingDotIcon'
import NotFound from './NotFound';
import StateContext from '../StateContext';
import DispatchedContext from '../DispatchedContext';

function ViewSinglePost(props) {
    const appState = useContext(StateContext)
    const appDispatched = useContext(DispatchedContext)
    const {id} = useParams()
    const [ isLoading, setIsLoading ] = useState(true)
    const [post, setPost] = useState({
      author: 
      {
        username: '...',
        avatar:''
      },
      body: 'Loading',
      title: 'tr',
      createdDate: '',
      _id: ''
    })

    useEffect ( () => {

      const ourRequest = Axios.CancelToken.source()

      async function fetchPost() {
          try {
           const response = await Axios.get (`/post/${id}`, {cancelToken: ourRequest.token})
          //  console.log(response.data)
           setPost(response.data)
           setIsLoading()
          
          } catch (e) {
              console.log('something went wrong')
          }
      } fetchPost() 
      return () => {
        ourRequest.cancel()
      }
  } , [id])

  if (!isLoading && !post)
  {
    return <NotFound/>
  }

    if( isLoading ) 
    { return <Page title="..." >
      <LoadingDotIcon/>
    </Page>}
    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} `

    function isOwner() {
      if (appState.loggedIn) {
        return appState.user.username == post.author.username
      }
      return false
    }

   async function deleteHandler(){
      const areYouSure = window.confirm("Do you really want to delete this post?")
      if(areYouSure){
            try {
              const response = await Axios.delete( `/post/${id}`, {data: {token: appState.user.token}} )
              console.log(response.data)
              if (response.data == "Success"){
                // 1. display a flash message
                appDispatched({type: "flashMessages", value: "Post was successfully deleted"})
                
                //2. redirect back to the current
                props.history.push(`/profile/${appState.user.username}`)
              }
            }catch(e){
              console.log("there was a problem")
            
            }
      }
    }

    return (
      
        <Page title={post.title}>
            <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        { isOwner() && (
          <span className="pt-2">
          <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2"><i className="fas fa-edit"></i></Link>
          <ReactTooltip id='edit' className="custom-tooltip" />
          {' '}
          <a onClick={deleteHandler}  className="delete-post-button text-danger" data-tip='Delete' data-for="delete"><i className="fas fa-trash"></i></a>
          <ReactTooltip id='delete' className="custom-tooltip"/>
        </span>
        ) }
      
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}/posts`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}/posts`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <p>
         <ReactMarkdown source={post.body} />
        </p>
      </div>
        </Page>
    )
}

export default withRouter(ViewSinglePost)
