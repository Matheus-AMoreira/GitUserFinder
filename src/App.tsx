import { useRef, useState } from "react";

import { VscSearch } from 'react-icons/vsc'
import { RiGitRepositoryLine } from "react-icons/ri";
import { AiOutlineHome } from "react-icons/ai";

import classes from "./App.module.css";

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
console.log(userData.location)
  return (
    <div className={classes.main}>
      <div className={classes.search}>
        <h1>Git User Finder</h1>
        <div>
          <input type='text' onInput={(e) => userName.current = e.currentTarget.value} onKeyDown={(e) => {e.key == 'Enter' && SearchUser(userName.current)}}></input>
          <button className='buttonIcon' onClick={() => SearchUser(userName.current)}><VscSearch/></button>
        </div>
      </div>
      <div>
        {
          error ? (userName.current.length > 0 ? <p>User {userName.current} don't exist</p> : <p>Try to find a user</p>) : 
          <div className={classes.user}>
            <div className={classes.userinfo}>
                <img src={userData.avatar_url}/>
                <h1>{userData.name}</h1>
                <div className={classes.follow}>
                  <h3>Followers {userData.followers}</h3>
                  <h3>Following {userData.following}</h3>
                </div>
                <h3><AiOutlineHome /> {userData.location != null ? userData.location : "Location not informed"}</h3>
                <h3><RiGitRepositoryLine /> {userData.public_repos} repositories</h3>
            </div>
            <div className={classes.repo}>
              {
                repoData.length <= 0 ? <p>This user don't have any repository yet</p> :
                  repoData.map((repo) => <Repos key={repo.id} {...repo}/>)
              }
            </div>
          </div>
        }
      </div>
    </div>
  ) 
}

export default App
