import { useRef, useState } from "react";
import { GitProject, UserProps } from "../types/types";

export default function User({name, avatar_url, location, followers, following}:UserProps){

    let repoData = useRef<GitProject>()
    const [error, setError] = useState<boolean>(false);

    async function fetchRepos(){
        const repos = await fetch(`https://api.github.com/users/${name}/repos`)

          if(repos != null){
            repoData.current = await repos.json();
            console.log(repoData.current)
            setError(true)
          }
          else
          {
            setError(false)
          }
    }
    
    return(
        <>
          <ul>
            <li><img src={avatar_url}/></li>
            <li>{name}</li>
            <li>Location{location}</li>
            <li>Fallowers{followers}</li>
            <li>following{following}</li>
          </ul>
        </>
    )
}