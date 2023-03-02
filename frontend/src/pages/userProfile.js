import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Post from "./post"
import axios from "axios"
export default function UserProfile() {
    const location = useLocation()
    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])
    const [profile, setProfile] = useState("")
    const postlist = []
    const currentuser = localStorage.getItem("id")
    function getUser() {
        axios({
            method: "GET",
            url: '/api/users/'.concat(location.state.pk)
        }).then(response => setUser(response.data))

        axios.get(`/api/profile/${location.state.profile}`).then(response => setProfile(response.data))
    }

    function getPosts() {
        axios(
            {
                method: "get",
                url: `/api/profile/posts/${location.state.pk}/`
            }
        ).then(response => setPosts(response.data))
    }
    function follow(e) {
        if (e.target.value == "Follow") {
            e.target.value = "unfollow"
            axios.post(`/api/users/${location.state.pk}/follow/`, { following: currentuser, followed: user.pk })

        }
        else{
            e.target.value = "Follow"
            axios.put(`/api/users/${location.state.pk}/follow/`, { following: currentuser, followed: user.pk })


        }
    }
    const elements = posts.map(post => <Post likes={post.likes} profile={post.profile} pb={post.publicationDate} pk={post.pk} title={post.title} authorpk={post.author} author={user.username} text={post.text} />)
    for (let i = 0; i < elements.length; i++) {
        if (i++ % 2 === 0) {
            postlist.push(<div className="profile_post_line">{elements[i]} {elements[i - 1]} </div>)
        }

    }
    var status = true
    useEffect(getUser, [location.state.pk, location.state.profile])
    useEffect(getPosts, [location.state.pk])
    if (currentuser == location.state.pk) {
        status = false
    }
    return (
        <main>
            <div className="profile_page">
                <div className="personal_info">
                    <div className="profile_image">
                        {profile.profile_image ? <img className="profile" src={profile.profile_image} alt="" /> : ""}
                    </div>
                    <div className="info">
                        <div className="profile_email_box">
                            <h1>{user.username}</h1>
                            <h2>{user.email}</h2>
                        </div>
                        <p>{profile.bio}</p>
                    </div>
                    <div id="user_profile_functions" className="profile_functions">
                        {status ? <input type="button" value={"Follow"} className="button" onClick={follow} /> : ""}
                    </div>
                </div>
                <div className="profile_posts">
                    {postlist}
                </div>

            </div>
        </main>
    )
}