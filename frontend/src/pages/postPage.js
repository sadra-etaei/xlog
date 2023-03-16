import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import heart from "../media/icons/heart.png"
import redheart from "../media/icons/icons8-heart-suit-48.png"
import save from "../media/icons/save-instagram.png"
import unsave from "../media/icons/bookmark.png"
import Comment from "./comment"
export default function PostPage() {
    const loggedin = localStorage.getItem("loggedin")
    const navigate = useNavigate()
    const [profile, setProfile] = useState("")
    const [commentText, setCommentText] = useState("")
    const [comments, setComments] = useState([])

    const username = localStorage.getItem("username")
    const userid = localStorage.getItem("id")
    const loc = useLocation()
    const [likeimg, setLikeimg] = useState(loc.state.likes.includes(String(userid)) ? redheart : heart)
    const [saveimg, setSaveimg] = useState(loc.state.saved.includes(String(loc.state.pk)) ? unsave : save)
    function getProfile() {
        axios.get(`/api/profile/${loc.state.profile}`).then(response => setProfile(response.data))
    }
    useEffect(getProfile, [userid])
    function deletePost() {
        axios.delete(`/api/posts/${loc.state.pk}`).then(response => console.log(response))
            .catch(error => console.log(error.response.data)).then(navigate("/home"))
    }
    function publishPost() {
        axios.post(`/api/posts/${loc.state.pk}/publish/`, { pk: loc.state.pk }).then(navigate("/home"))

    }
    function likePost() {
        if (likeimg === heart) {
            setLikeimg(redheart)
            axios.post(`/api/posts/${loc.state.pk}/like/`, { pk: loc.state.pk, user: userid }).then(response => console.log(response.data))
        }
        else {
            axios.put(`/api/posts/${loc.state.pk}/like/`, { pk: loc.state.pk, user: userid }).then(response => console.log(response.data))
            setLikeimg(heart)
        }
    }

    function updatePost() {
        navigate(`/update/${loc.state.pk}`, { state: loc.state })
    }

    function savePost() {
        if (saveimg === save) {
            setSaveimg(unsave)
            axios.post(`/api/posts/${loc.state.pk}/save/`, { post: loc.state.pk, user: userid }).then(response => console.log(response.data))


        }
        else {
            axios.put(`/api/posts/${loc.state.pk}/save/`, { pk: loc.state.pk, user: userid }).then(response => console.log(response.data))
            setSaveimg(save)
        }
    }
    function handleChange(e) {
        setCommentText(e.target.value)
    }

    function comment(e) {
        e.preventDefault()
        const data = { text: commentText, post: loc.state.pk, user: userid, writtenDate: new Date() }
        axios.post(`/api/post/comment/${loc.state.pk}/`, data).then(response => console.log(response.data))
        console.log(data)
        window.location.reload()
    }

    function getComments() {
        axios.get(`/api/post/${loc.state.pk}/comments/`).then(response => setComments(response.data))
    }

    useEffect(getComments, [])

    const commentElements = comments.map(comment => <Comment text={comment.text} date={comment.writtenDate} user={comment.user} post={comment.post} />)
    var status = ""
    if (loc.state.author == userid) {
        status = true
    }
    else {
        status = false
    }

    return (
        <div className="postPage">
            <div className="post_page_info">
                <div className="post_profile" >
                    <img id="post_profile_img" src={profile.profile_image} alt="" />
                </div>
                <div className="post_page_details">
                    <h3>{loc.state.user}</h3>
                    <p>{loc.state.pb}</p>
                </div>
            </div>
            <h1>{loc.state.title}</h1>
            <p className="post_page_text">{loc.state.text}</p>
            <div className="postPage_buttons">
                <div>
                    <label>{loc.state.likes ? loc.state.likes.length : ""}</label>
                    {loggedin ? <input className="postlike" type={"image"} src={likeimg} alt="" onClick={likePost} /> : ""}
                    {loggedin ? <input className="postsave" type={"image"} src={saveimg} alt="" onClick={savePost} /> : ""}
                </div>
                {status ? <button className="button" onClick={updatePost}>update this post </button> : ""}
                {status ? <button className="button" onClick={deletePost}>delete this post </button> : ""}
                {loc.state.pb ? "" : <button className="button" onClick={publishPost}>publish this post</button>}
            </div>
            <div className="comment_section">
                <h1>Comment on this Post :</h1>

                <form onSubmit={comment} className="comment_box">
                    <textarea onChange={handleChange} id="comment_text" ></textarea>
                    <input id="comment_submit" className="button" type={"submit"} />
                </form>

                <div className="comments">
                    {commentElements}
                </div>
            </div>
        </div>
    )
}