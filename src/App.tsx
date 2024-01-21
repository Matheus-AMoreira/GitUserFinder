import { useRef, useState } from "react";

import { VscSearch } from 'react-icons/vsc'

import classes from "./App.module.css";

import { UserProps, GitProject } from "./types/types";

import User from "./Components/User";

function App() {

  const [userData, setUserData] = useState<UserProps>({})
  let userName = useRef<string>("")
  let error = useRef<boolean>(true);
  
  async function SearchUser(name: string){

    if(name.length > 0)
    {
      const user = await fetch(`https://api.github.com/users/${name}`)

      if(user.status != 404)
      {
        setUserData(await user.json());
        console.log(userData)
        error.current = false
      }
      else
      {
        error.current = true
        setUserData({});
        console.log(userData)
      }
    }
    else 
    {
      error.current = true
      setUserData({})
      alert("Please try to insert a user to be found")
    }
  }

  return (
    <>
      <div>
        <h1>GitHub Finder</h1>
        <input type='text' onInput={(e) => userName.current = e.currentTarget.value} onKeyDown={(e) => {e.key == 'Enter' && SearchUser(userName.current)}}></input>
        <button className='buttonIcon' onClick={() => SearchUser(userName.current)}><VscSearch/></button>
      </div>
      <div>
        {error.current ? (userName.current.length > 0 ? <h3>User {userName.current} don't exist</h3>: <h3>Try to find a user</h3>) : <User {...userData} />}
      </div>
    </>
  ) 
}

export default App
