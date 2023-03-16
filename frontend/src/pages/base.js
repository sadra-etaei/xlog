import { Outlet, Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import "./pages.css"
import axios from "axios"
import { useEffect } from "react";

export default function Base() {
    const nav = useNavigate()
    const loggedin = localStorage.getItem("loggedin")
    const id = localStorage.getItem("id")
    const profilepk = Number(localStorage.getItem("profile"))
    console.log(profilepk)
    const links = document.getElementsByClassName("link")
    const { pathname } = useLocation()

    function Logout() {
        axios.get(`/api/logout/${id}/`).then(response => console.log(response.data)).catch(err => console.log(err))
        localStorage.removeItem("loggedin")
        localStorage.removeItem("id")
        localStorage.removeItem("username")
        localStorage.removeItem("email")
        nav("/")
    }

    function getProfile() {
        axios({
            "url": "/api/profile/".concat(profilepk),
            "method": "GET"
        }).then(response =>
            localStorage.setItem('profileimg', response.data.profile_image)
        )
    }
    useEffect(getProfile, [profilepk])
    getProfile()

    const profile = localStorage.getItem("profileimg")


    return (
        <main>
            <div id="nav_section" className="navbar">
                <div className="left_nav">
                    {loggedin ? <Link className="link" to="/home" > <h1>Xlog</h1></Link> : <Link className="link" to="/" > <h1>Xlog</h1></Link> }
                    {loggedin ? <Link className="link" to="/drafts" ><p>Drafts</p></Link> : ""}
                    {loggedin ? <Link className="link" to="/create" ><p>Create</p></Link> : ""}
                    {/* {loggedin ? <Link className="link" to="/topics" ><p>Topics</p></Link> : ""} */}
                </div>
                <div className="right_nav">
                    {loggedin ? <input type={"button"} onClick={Logout} id="btn" className="link" value={"Logout"} /> : <Link className="link" to="/signup" ><p>Signup</p></Link>}
                    {loggedin ? <Link className="link" to={`/profile/${id}`} >
                        <div id="navprofile" >
                            {profile ? <img id="base_profile" className="profile" src={profile} alt="" /> : <div id="base_circle" className="circle"></div>}
                        </div>
                    </Link> : <Link className="link" to="/login" ><p>Login</p></Link>}
                </div>

            </div>
            <Outlet />
        </main>
    )
}