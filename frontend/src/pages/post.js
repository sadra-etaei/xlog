import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios"
import heart from "../media/icons/heart.png"
import redheart from "../media/icons/icons8-heart-suit-48.png"
import save from "../media/icons/save-instagram.png"
import unsave from "../media/icons/bookmark.png"
export default function Post(props) {
    const page = "/posts/".concat(props.pk)
    const profilePage = "/users/".concat(props.authorpk)
    const [author, setAuthor] = useState({})
    const [profile, setProfile] = useState("")

    const loggedin = localStorage.getItem("loggedin")
    const userid = localStorage.getItem("id")
    const [likeimg, setLikeimg] = useState(props.likes.includes(String(userid)) ? redheart : heart)

    const [saveimg, setSaveimg] = useState(save)
    function getAuthor(pk) {
        axios({
            method: "GET",
            url: "/api/users/".concat(pk)
        }).then((response) => {
            setAuthor(response.data)
        })

    }
    useEffect(() => getAuthor(props.authorpk), [props.authorpk])
    function likePost() {
        if (likeimg === heart) {
            setLikeimg(redheart)
            axios.post(`/api/posts/${props.pk}/like/`, { pk: props.pk, user: userid }).then(response => console.log(response.data))
        }
        else {
            axios.put(`/api/posts/${props.pk}/like/`, { pk: props.pk, user: userid }).then(response => console.log(response.data))
            setLikeimg(heart)
        }
    }

    function savePost() {
        if (saveimg === save) {
            setSaveimg(unsave)
            axios.post(`/api/posts/${props.pk}/save/`, { post: props.pk, user: userid }).then(response => console.log(response.data))


        }
        else {
            axios.put(`/api/posts/${props.pk}/save/`, { pk: props.pk, user: userid }).then(response => console.log(response.data))
            setSaveimg(save)
        }
    }



    function getProfile() {
        axios.get(`/api/profile/${props.profile}`).then(response => setProfile(response.data))
    }
    useEffect(getProfile, [author])
    return (
        <div style={{ height: props.height, width: props.width }} className="post_box">
            <div className="post_info">
                <div className="post_upper_info">
                    <div className="post_box_profile">
                        <img className="post_box_profile_img" src={profile.profile_image} alt="none" />
                    </div>
                    <h3><Link className="post_link" to={profilePage} state={{ "pk": props.authorpk, "profile": Number(author.profile) }}  >{author.username}</Link></h3>
                    <p>{props.pb}</p>
                </div>
                <h2><Link className="post_link" to={page} state={{ pb: props.pb, likes: props.likes, pk: props.pk, publicationDate: props.publicationDate, author: props.authorpk, user: author.username, title: props.title, text: props.text, profile: props.profile, saved: author.postsSaved }}>{props.title}</Link></h2>
                {props.notshowtext ? "" : <p className="post_box_text">{props.text}</p>}
            </div>
            <Outlet />
            <div className="post_box_functions">
                {loggedin ? <label htmlFor="like">{props.likes ? props.likes.length : ""}</label> : ""}
                {loggedin ? <input name="like" className="postlike" type={"image"} src={likeimg} alt="" onClick={likePost} /> : ""}
                {loggedin ? <input className="postsave" type={"image"} src={saveimg} alt="" onClick={savePost} /> : ""}
            </div>
        </div>

    )
}