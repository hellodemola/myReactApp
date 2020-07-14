import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import {useParams, Link} from 'react-router-dom'
import LoadingDotIcon from './LoadingDotIcon'
import Post from './Post'

function ProfilePost(props) {
    const {username} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])

useEffect ( () => {
    async function fetchPosts() {
        try {
         const response = await Axios.get (`/profile/${username}/posts`)
         setPosts(response.data)
         setIsLoading()
        
        } catch (e) {
            console.log('something went wrong')
        }
    } fetchPosts()
} , [username])

  
if (isLoading) 
{  
    return <div>  <LoadingDotIcon/> </div> 
}
    return (
        <div className="list-group">
        {posts.map( (post) => {
            return <Post noAuthor={true} post={post} key={post._id}/>
        } )}
       
      </div>
    )
}

export default ProfilePost
