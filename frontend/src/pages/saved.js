import { useState, useEffect } from "react"
import Post from "./post"
import axios from "axios"
export default function Saved() {
    const [posts, setPosts] = useState([])
    var userid = localStorage.getItem("id")
    function getSaved() {
        axios.get(`/api/saved/${userid}/`).then(response => setPosts(response.data))
    }
    useEffect(getSaved,[])


    var stat
    if(posts == [] || posts == false){
        stat = false
    }
    else{
        stat= true
    }
    const elements = posts.map(s => <Post likes={s.post.likes} profile={s.post.profile} publicationDate={s.post.publicationDate} pb={s.post.publicationShortDate} pk={s.post.pk} title={s.post.title} authorpk={s.post.author} text={s.post.text} />)

    return (

        <main>
            {stat ? elements : <p>you have no saved articles</p>}
        </main>
    )


}