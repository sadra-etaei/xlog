import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
export default function Update() {
    const nav = useNavigate()
    const loc = useLocation("")
    // const user = localStorage.getItem("username")
    // const userid = localStorage.getItem("id")
    const [form, setForm] = useState({ text: "" })
    function handleChange(event) {
        setForm(prevForm => { return { ...prevForm, pk: loc.state.pk } })
        if (event.target.name === "title") {
            setForm(prevForm => { return { ...prevForm, title: event.target.value } })
        }
        if (event.target.name === "textarea") {
            setForm(prevForm => { return { ...prevForm, text: event.target.value } })
        }
    }
    function postForm(event) {
        event.preventDefault()
        axios.post(`/api/posts/${loc.state.pk}/update/`, JSON.stringify(form), {
            "headers": {
                'Content-Type': 'application/json',
            }
        })
            .then(response => nav(`/posts/${response.data.pk}`, { state: response.data }))
    }
    return (
        <div>
            <div onSubmit={postForm} className="postform-box">
                <form className="postform" method="POST">
                    <div>
                        <label for="title" >Title : </label>
                        <input name="title" type={"title"} id={"titleinput"} onChange={handleChange} />
                    </div>

                    <div>
                        <textarea name="textarea" id="textarea" onChange={handleChange} />
                    </div>
                    <input id="postsubmit" className="button" type={"submit"} value="Submit" />
                </form>
            </div>

        </div>
    )
}