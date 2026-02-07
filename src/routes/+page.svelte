<script lang="ts">
    import "./index.css"
    import type { UserProps, GitProject } from "../types/types";
    import { Eye, FolderGit, GitFork, House, Search, Star } from "@lucide/svelte";

    let userData: UserProps = $state({})
    let repoData: GitProject[] = $state([])
    let error: boolean = $state(false);

    let username = $state("")

    function SearchUser() {
      if (username.length > 0) {
        fetch(`https://api.github.com/users/${username}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw response;
          })
          .then((data) => {
            if (data.public_repos > 0) {
              FetchRepos(data.repos_url);
            }
            console.log(data)
            error = false;
            userData = data;
          })
          .catch((err) => {
            console.log(err);
            error = true;
            userData = {};
          });
      }
      else {
        error = true;
      }
    }

    function FetchRepos(url: string) {
      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((data) => {
          repoData = data;
        })
        .catch((err) => {
          error = true
          repoData = []
          console.log(err);
        });
    }

</script>

<svelte:head>
	<title>Git Finder</title>
	<meta name="description" content="Sevelte app to find github users and show theirs repositories" />
</svelte:head>

<section>
    <div class = main>
         <div class = search>
           <h1>Git User Finder</h1>
           <div>
             <input class={error ? "inputError" : ""} type='text' bind:value={username} onkeydown={(e) => e.key=="Enter" && SearchUser()}/>
             <button class='buttonIcon' onclick={SearchUser}><Search /></button>
           </div>
         </div>
         <div>
             {#if error}
                 <p>User {username} don't exist</p>
            {:else}
             {#if userData.name }
             <div class = user>
               <div class= userinfo>
                   <img src={userData.avatar_url} alt="userData.name avatar"/>
                   <h1>{userData.name}</h1>
                   <h2>{userData.bio}</h2>
                   <div class = follow>
                     <h3>Followers {userData.followers}</h3>
                     <h3>Following {userData.following}</h3>
                   </div>
                   <h3><House /> {userData.location != null ? userData.location : "Location not informed"}</h3>
                   <h3><FolderGit /> {userData.public_repos} repositories</h3>
               </div>
               <div class = repo>
                 {#if repoData.length <= 0}
                     <p>This user don't have any repository yet</p>
                {:else}
                    {#each repoData as repository }
                        <div class=repoContainer>
                            <a href={repository.html_url} target="_blank">{repository.full_name}</a>
                            <h4>License: {repository.name == undefined ? "No license" : repository.license?.name}</h4>
                            <h4><Eye /> {repository.watchers} watching</h4>
                            <h4><GitFork /> {repository.forks} forks</h4>
                            <h4><Star /> {repository.stargazers_count} stars</h4>
                        </div>
                    {/each}
                {/if}
               </div>
             </div>
               {:else}
               <p>Try to find a user</p>
               {/if}
             {/if}
             </div>
        </div>
</section>

<style>
    .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #010409;
        padding: 1rem;
        width: 80vw;
        border: 1px solid white;
        border-radius: 10px;
    }

    .inputError {
        border-color: red;
    }

    .search {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .repo {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .follow {
        display: flex;
        justify-content: space-around;
    }

    .userinfo {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>
