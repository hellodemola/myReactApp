import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import {useParams,Link} from 'react-router-dom'
import LoadingDotIcon from './LoadingDotIcon'

function ProfileFollowers(props) {
    const {username} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])

useEffect ( () => {
    async function fetchPosts() {
        try {
         const response = await Axios.get (`/profile/${username}/followers`)
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

        {posts.map( (followers, index) => {
          
            return (
        <Link key={index} to={`/profile/${followers.username}`} className="list-group-item list-group-item-action">
          <img className="avatar-tiny" src={followers.avatar} /> {followers.username}
        </Link>
            )
        } )}
       
      </div>
    )
}

export default ProfileFollowers
