
import { useState, useEffect } from "react"
import Post from "./post"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import User from "./user"
import closeicon from "../media/icons/icons8-macos-close-32.png"
export default function Profile() {
    var followerList = document.getElementsByClassName("followingList")[1]
    var edit = document.getElementsByClassName("edit")[0]
    var followingList = document.getElementsByClassName("followingList")[0]
    var body = document.getElementsByClassName("profile")[0]
    var upload = document.getElementById("upload")
    const nav = useNavigate("")
    const user = { username: localStorage.getItem("username"), email: localStorage.getItem("email"), id: localStorage.getItem("id"), profile: localStorage.getItem("profile"), following: localStorage.getItem("following") }
    const [posts, setPosts] = useState([])
    const [profile, setProfile] = useState({})
    const [form, setForm] = useState({})
    const [followings, setFollowings] = useState([])
    const [followers, setFollowers] = useState([])
    const [elements, setElements] = useState([])

    function getPosts() {
        axios(
            {
                method: "get",
                url: `/api/profile/posts/${user.id}/`
            }
        ).then(response => setPosts(response.data))

        axios.get(`/api/profile/${user.profile}`).then(response => setProfile(response.data))
    }
    function getStuff() {
        axios.get(`/api/followings/${user.id}/`).then(response => {
            setFollowings(response.data)
            response.data.forEach(fu => {
                axios.get(`/api/profile/${fu.profile}/`).then(response => Object.assign(fu, { prof: response.data }))
            })
        })

        // followings.forEach(fu => {
        //     axios.get(`/api/profile/${fu.profile}/`).then(response => Object.assign(fu, { prof: response.data }))
        // })

        axios.get(`/api/followers/${user.id}`).then(response => {
            setFollowers(response.data)
            response.data.forEach(fu => {
                axios.get(`/api/profile/${fu.profile}/`).then(response => Object.assign(fu, { prof: response.data }))
            })
            console.log(response.data)

        })
    }

    function handleClick() {
        if (edit.style.display === "none") {
            edit.style.display = "flex"
            body.setAttribute("id", "blur")
            body.style.opacity = "0.1"



        }
        else {
            edit.style.display = "none"
            body.style.opacity = "1"

            body.setAttribute("id", null)


        }
    }
    const postlist = []
    const items = posts.map(post => <Post likes={post.likes} class={"profile_post"} profile={post.profile} pb={post.publicationShortDate} pk={post.pk} title={post.title} authorpk={post.author} author={user.username} text={post.text} />)
    for (let i = 0; i < items.length; i++) {
        if (i++ % 2 === 0) {
            postlist.push(<div className="profile_post_line">{items[i]} {items[i - 1]} </div>)
        }

    }
    useEffect(getPosts, [])
    useEffect(getStuff, [])
    function handleChange(event) {
        if (event.target.name === "img") {
            setForm(prevForm => { return { ...prevForm, profile_image: upload.files[0] } })
        }
        if (event.target.name === "bio") {
            setForm(prevForm => { return { ...prevForm, bio: event.target.value } })
        }
    }
    function updateProfile(e) {
        e.preventDefault()
        console.log(form.profile_image)
        const form_data = new FormData()
        form_data.set("bio", form.bio)
        // form_data.set("profile_image", form.profile_image)
        form_data.set('profile_img',
            form.profile_image
            // url: form.profile_image.url,
            // name: form.profile_image.name, 
            // type: form.profile_image.type 

        )
        axios.post(`/api/profile/${user.profile}/`, form_data, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${form_data._boundary}`,

            }
        }).then(response => console.log(response.data))
        console.log(form.bio)

        edit.style.display = "none"
        body.setAttribute("id", null)
        body.style.opacity = "1"


    }

    function followingDisplay() {
        if (followingList.style.display === "none") {
            followingList.style.display = "flex"
            body.setAttribute("id", "blur")
            body.style.opacity = "0.1"

        }
        else {
            followingList.style.display = "none"
            body.style.opacity = "1"
            body.setAttribute("id", null)


        }
        setElements(followings.map(fu => <User username={fu.username} profile_image={fu.prof ? fu.prof.profile_image : ""} bio={fu.prof ? fu.prof.bio : ""} />))
    }

    function followerDisplay() {
        if (followerList.style.display === "none") {
            followerList.style.display = "flex"
            body.setAttribute("id", "blur")
            body.style.opacity = "0.1"

        }
        else {
            followerList.style.display = "none"
            body.style.opacity = "1"
            body.setAttribute("id", null)


        }
        setElements(followers.map(fu => <User username={fu.username} profile_image={fu.prof ? fu.prof.profile_image : ""} bio={fu.prof ? fu.prof.bio : ""} />))
    }


    return (
        <div>
            <div className="followingList" style={{ display: "none" }}>
                <button onClick={followingDisplay} type="image" id="closelist"><img src={closeicon} alt="" /></button>
                <h2 id="following_count">{followings.length} Followings</h2>

                {elements}
            </div>

            <div id="followerList" className="followingList" style={{ display: "none" }}>
                <button onClick={followerDisplay} type="image" id="closelist"><img src={closeicon} alt="" /></button>
                <h2 id="following_count">{followers.length} Followers</h2>

                {elements}
            </div>
            <div>
                <form onSubmit={updateProfile} className="edit">
                    <label className="circle" for="upload">
                        <input name="img" onChange={handleChange} type="file" id="upload" style={{ display: "none" }} />
                    </label>
                    <div className="input">
                        <label htmlFor="bio">Bio :</label>
                        <input onChange={handleChange} type={"text"} name="bio" />
                    </div>
                    <button type="submit" className="button">Submit</button>
                    <button onClick={handleClick} type="image" id="closelist_edit"><img src={closeicon} alt="" /></button>


                </form>
            </div>
            <main>
                <div className="profile_page">
                    <div className="personal_info">
                        <div className="profile_image">
                            {profile.profile_image ? <img className="profile" src={profile.profile_image} alt="" /> : <div className="Circle"></div>}
                        </div>
                        <div className="info">
                            <div className="profile_email_box">
                                <h1>{user.username}</h1>
                                <h2>{user.email}</h2>
                            </div>
                            <p>{profile.bio}</p>
                        </div>
                        <div className="profile_functions">
                            <button className="button" onClick={handleClick}>Edit your profile</button>
                            <button onClick={() => { nav('/saved/') }} className="button" >Saved articles</button>
                            <button onClick={followingDisplay} className="button">Following</button>
                            <button onClick={followerDisplay} className="button" >Followers</button>
                        </div>
                    </div>
                    <div className="profile_posts">
                        {postlist}
                    </div>

                </div>
            </main>
        </div>
    )
}