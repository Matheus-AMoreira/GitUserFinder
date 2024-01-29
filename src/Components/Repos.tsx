import { GitProject } from "../types/types";

import classes from "./Repos.module.css";

import { MdOutlineStar } from "react-icons/md";
import { GoRepoForked, GoEye } from "react-icons/go";

export default function Repos({name, html_url, license, watchers, forks, stargazers_count}:GitProject){
    return (
        <div className={classes.repoContainer}>
            <a href={html_url} target="_blank">{name}</a>
            <h4>License: {license?.name == undefined ? "No license" : license.name}</h4>
            <h4><GoEye /> {watchers} watching</h4>
            <h4><GoRepoForked />{forks} forks</h4>
            <h4><MdOutlineStar /> {stargazers_count} stars</h4>
        </div>
    )
}