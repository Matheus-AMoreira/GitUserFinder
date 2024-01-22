import { GitProject } from "../types/types";

export default function Repos({name, html_url, license, watchers, forks, stargazers_count}:GitProject){
    return (
        <dl>
            <dt><a href={html_url}>{name}</a></dt>
                <dd>{license?.name}</dd>
                <dd>Wachters: {watchers}</dd>
                <dd>Forks: {forks}</dd>
                <dd>Stars: {stargazers_count}</dd>
        </dl>
    )
}