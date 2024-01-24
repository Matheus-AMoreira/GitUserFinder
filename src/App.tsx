import { useRef, useState } from "react";

import { VscSearch } from 'react-icons/vsc'

//import classes from "./App.module.css";

import { UserProps, GitProject } from "./types/types";
import Repos from "./Components/Repos";

function App() {

  const [userData, setUserData] = useState<UserProps>({})
  const [repoData, setRepoData] = useState<GitProject[]>([])
  const [error, setError] = useState<boolean>(true);

  let userName = useRef<string>("")
  
  async function SearchUser(name: string){

    if(name.length > 0)
    {
      await fetch(`https://api.github.com/users/${name}`)
        .then(response => {
          if(response.ok){
            return response.json()
          }
          throw response
        }).then(data => {
          if(data.public_repos > 0)
          {
            FetchRepos(data.repos_url)
          }
          setUserData(data)
          setError(false)
        }).catch(err => {
          console.log(err)
          setError(true)
        })

      await fetch(userData?.repos_url!)
        .then(response => {
          if(response.ok){
            return response.json()
          }
          throw response
        }).then(data => {
          setRepoData(data)
        }).catch(err => {
          console.log(err)
        })
    }
    else 
    {
      setError(true)
      setUserData({})
      alert("Please try to insert a user to be found")
    }
  }

  async function FetchRepos(url: string){
    fetch(url)
      .then(response =>{
        if(response.ok){
          return response.json()
        }
        throw response
      }).then(data => {
        setRepoData(data)
      }).catch(err =>{
        console.log(err)
      })
  }

  return (
    <>
      <div>
        <h1>GitHub Finder</h1>
        <input type='text' onInput={(e) => userName.current = e.currentTarget.value} onKeyDown={(e) => {e.key == 'Enter' && SearchUser(userName.current)}}></input>
        <button className='buttonIcon' onClick={() => SearchUser(userName.current)}><VscSearch/></button>
      </div>
      <div>
        {
          error ? (userName.current.length > 0 ? <h3>User {userName.current} don't exist</h3> : <h3>Try to find a user</h3>) : 
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
                repoData.length <= 0 ? <h3>This user don't have any repository yet</h3> :
                  repoData.map((repo) => <Repos key={repo.id} {...repo}/>)
              }
            </div>
          </div>
        }
      </div>
    </>
  ) 
}

export default App
