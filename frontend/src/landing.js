import bg from "./media/bgs/photo3184445660.jpg"
import "./App.css"
import { useEffect, useState } from "react"
import axios from "axios"
import Post from "./pages/post"

export default function LandingPage() {
    const [trends, setTrends] = useState([])
    function getTrends() {
        axios.get('/api/posts/trending/').then(response => setTrends(response.data))
    }
    useEffect(getTrends, [])
    const trendingElements = trends.map(post => <Post notshowtext={true} text={post.text} width={"400px"} height={"180px"} likes={post.likes} profile={post.profile} publicationDate={post.publicationDate} pb={post.publicationShortDate} pk={post.pk} title={post.title} authorpk={post.author} />)
    return (
        <div>
            <div className="bg">
                <img src={bg} alt="" />
                <h1>a place for your ideas</h1>
            </div>
            <div className="midpart">
                <h2 id="midpart_title">trending posts on blog</h2>
                <div className="trendbox">
                    {trendingElements}
                </div>
            </div>

            <div className="footer">
                <p>all rights belong to <a href="https://sadra-etaei.github.io/">Sadra Etaei</a> © 2023</p> 
            </div>
        </div>
    )
}