import { useEffect, useState } from "react"
import Post from "./post"
import axios from "axios"
export default function Drafts() {
    const [posts, setPosts] = useState([])

    const user = localStorage.getItem("username")
    const userid = localStorage.getItem("id")
    function getPosts() {
        axios({
            method: "GET",
            url: `/api/drafts/${userid}`
        }).then((response) => {
            const newposts = response.data
            setPosts(newposts)
            console.log(newposts)
        })
    }
    useEffect(getPosts, [])

    const elements = posts.map(post => <Post likes={post.likes} profile={post.profile} pb={post.publicationShortDate} pk={post.pk} title={post.title} authorpk={post.author} author={user} text={post.text} />)
    var postis = ""
    var status = true
    if (posts.length > 0 && user ){
        postis = true
    }
    else if(posts.length == 0 && user){
        postis = false
        status = false
    }

    return (
        <div className="content">
            {user ? " " : <p>you have to login first</p>}
            {status ? "" : "you have no drafts"}
            {postis ? elements  : ""}
        </div>
    )
}