import { useRef, useState } from "react";

import { VscSearch } from 'react-icons/vsc'

//import classes from "./App.module.css";

import { UserProps, GitProject } from "./types/types";
import Repos from "./Components/Repos";

function App() {

  const [userData, setUserData] = useState<UserProps>({})
  const [repoData, setRepoData] = useState<GitProject[]>()

  let userName = useRef<string>("")
  let error = useRef<boolean>(true);
  
  async function SearchUser(name: string){

    if(name.length > 0)
    {
      const user = await fetch(`https://api.github.com/users/${name}`)

      if(user.ok)
      {
        setUserData(await user.json());
        error.current = false
        if(userData.public_repos! > 0)  FetchRepos()
      }
      else
      {
        error.current = true
        setUserData({});
      }
    }
    else 
    {
      error.current = true
      setUserData({})
      alert("Please try to insert a user to be found")
    }
  }

  async function FetchRepos(){
    const repos = await fetch(`${userData.repos_url}`)
    if(repos.ok)
    {
      setRepoData(await repos.json())
    }
  }

  console.log(userData)
  console.log(repoData)

  return (
    <>
      <div>
        <h1>GitHub Finder</h1>
        <input type='text' onInput={(e) => userName.current = e.currentTarget.value} onKeyDown={(e) => {e.key == 'Enter' && SearchUser(userName.current)}}></input>
        <button className='buttonIcon' onClick={() => SearchUser(userName.current)}><VscSearch/></button>
      </div>
      <div>
        {
          error.current ? (userName.current.length > 0 ? <h3>User {userName.current} don't exist</h3> : <h3>Try to find a user</h3>) : 
          <div>
            <div>
              <ul>
                <li><img src={userData.avatar_url}/></li>
                <li>{userData.name}</li>
                <li>Location{userData.location}</li>
                <li>Fallowers{userData.followers}</li>
                <li>following{userData.following}</li>
                <li>Repos{userData.public_repos}</li>
              </ul>
            </div>
            <div>
              {
                userData.public_repos! <= 0 ? <h3>This user don't have any repository yet</h3> :
                  repoData?.map((repo) => <Repos {...repo}/>)
              }
            </div>
          </div>
        }
      </div>
    </>
  ) 
}

export default App
