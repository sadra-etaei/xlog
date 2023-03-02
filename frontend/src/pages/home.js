import axios from "axios"
import { useState, useEffect } from "react"
import Post from "./post"

export default function Home() {
    const [posts, setPosts] = useState([])
    const [trends, setTrends] = useState([])

    const userid = localStorage.getItem("id")

    function getPosts() {
        axios({
            method: "GET",
            url: `/api/feed/${userid}/`
        }).then((response) => {
            const newposts = response.data
            setPosts(newposts)
        })

        axios.get('/api/posts/trending/').then(response => setTrends(response.data))
    }
    useEffect(getPosts, [userid])
    const elements = posts.map(post => <Post likes={post.likes} profile={post.profile} publicationDate={post.publicationDate} pb={post.publicationShortDate} pk={post.pk} title={post.title} authorpk={post.author} text={post.text} />)
    const trendposts = trends.map(post => <Post notshowtext={true} text={post.text} width={"400px"} height={"170px"} likes={post.likes} profile={post.profile} publicationDate={post.publicationDate} pb={post.publicationShortDate} pk={post.pk} title={post.title} authorpk={post.author}  />)
    console.log(posts)
    return (
        <div className="home">
            <div className="home_content">
                {elements ? elements : "no posts yet"}
            </div>


            <div className="sidebar">
                <div className="sidebar-intro"><h3>Trending posts</h3></div>
                {trendposts}
            </div>
        </div>

    )
}