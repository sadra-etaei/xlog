import { useState, useEffect } from "react"
import { Outlet, Link } from "react-router-dom";
import axios from "axios"
import { useNavigate } from "react-router-dom";


export default function Create() {
    const nav = useNavigate()
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("username")
    const userid = localStorage.getItem("id")
    const profileid = localStorage.getItem("profile")
    const [form, setForm] = useState({ text: "" })
    function handleChange(event) {
        setForm(prevForm => { return { ...prevForm, authorAvatar: profileid } })
        setForm(prevForm => { return { ...prevForm, author: userid } })
        if (event.target.name === "title") {
            setForm(prevForm => { return { ...prevForm, title: event.target.value } })
        }
        if (event.target.name === "textarea") {
            setForm(prevForm => { return { ...prevForm, text: event.target.value } })
        }
    }

    function postForm(event) {
        event.preventDefault()
        axios.post('/api/post/create', JSON.stringify(form), {
            "headers": {
                "Authentication" :`Token ${token}`, 
                'Content-Type': 'application/json',
            }
        })
            .then(response => nav(`/posts/${response.data.pk}`, { state: { ...response.data, user: user , likes : [] , saved : [] } }))
        console.log(form)
    }
    return (
        <div>
            {user ? <div onSubmit={postForm} className="postform-box">
                <form className="postform" method="POST">
                    <div className="title_in_class">
                        <label for="title" >Title : </label>
                        <input name="title" type={"text"} id="titleinput" onChange={handleChange} />
                    </div>

                    <div>
                        <textarea name="textarea" id="textarea" onChange={handleChange} />
                    </div>
                    <input id="postsubmit" className="button" type={"submit"} value="Submit" />
                </form>
            </div> : <p>you have to login first</p>}

        </div>
    )
}