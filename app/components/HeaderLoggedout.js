import React, { useState, useContext } from 'react'
import Axios from 'axios'
import DispatchedContext from '../DispatchedContext'

function HeaderLoggedOut (props){ 
    
  //  const {setLoggedIn} = useContext(ExampleContext)
  //  const {addFlashMessage} = useContext(ExampleContext)

  const appDispatch = useContext(DispatchedContext)

    const [username , setUsername] = useState();
    const [password, setPassword] = useState();

   async function handleSubmit (e) {
        e.preventDefault();
        try {
           const response = await Axios.post('/login', {username, password})
           if (response.data) {
            // console.log(response.data)
           
            
            appDispatch({type: "login", data: response.data})
            appDispatch({type: "flashMessages", value: "You have successfully logged in"})
          //  addFlashMessage(' You\'ve successfully logged in ')
           }else {
            console.log('Incorrect username or password')
            appDispatch({type: "flashMessages", value: "Invalid username and password"})
            console.log(response.data)
           }
            // console.log(response.data)
        } catch (e){
            console.log('there was a problem')
        }
    }
   
        return (
            <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
            <div className="row align-items-center">
              <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
              </div>
              <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
              </div>
              <div className="col-md-auto">
                <button  className="btn btn-success btn-sm">Sign In</button>
              </div>
            </div>
          </form>
        )
  

}

export default HeaderLoggedOut