import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
export default function Login() {
    const nav = useNavigate()
    const [form, setForm] = useState({})
    const [error, setError] = useState([])

    function onChange(event) {
        // validateForm()
        if (event.target.name === "username") {
            setForm(prev => { return { ...prev, username: event.target.value } })
        }
        if (event.target.name === "pass") {
            setForm(prev => { return { ...prev, password: event.target.value } })
        }
    }
    function validateForm() {

        if (form.username == null) {
            setError(["please fill out the blanks"])
        }
        else if (form.password == null) {
            setError(["please fill out the blanks"])

        }
        else if (form.username.length < 4 & form.username.length > 0) {
            setError(prev => {
                if (error.includes("usernames should be more than 4 characters") === false) {
                    return [...prev, "usernames should be more than 4 characters"]
                }
                else {
                    return [...prev]
                }
            })
            // setError("username should be more then 4 characters")

        }
        else {
            setError("")
        }
        return error
    }

    var error_messages = ""
    if (error != "") {
        error_messages = error.map(e => <p id="error_message">{e}</p>)
    }
    function Login(e) {
        e.preventDefault()
        axios.defaults.xsrfCookieName = 'csrftoken'
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
        if (validateForm() == "") {
            axios.post("api/login/", JSON.stringify(form), {
                "headers": {
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                localStorage.setItem("loggedin", "true")
                localStorage.setItem("username", response.data.username)
                localStorage.setItem("email", response.data.email)
                localStorage.setItem("id", response.data.id)
                localStorage.setItem("profile", response.data.profile)
                localStorage.setItem('following', response.data.following)
                localStorage.setItem('saved',response.data.saved)
                localStorage.setItem('token',response.data.token)

                console.log(response.data)
                nav(`/profile/${response.data.id}`, { state: response.data.id })
            }
            ).catch(err => console.log(err))
            console.log(form)
        }
    }
    return (
        <div>
            <div id="loginform" className="registration_formbox">
                <h1>Login</h1>
                <form onSubmit={Login} method="post">
                    <div className="registration_field">
                        <label htmlFor="username" >Username :</label>
                        <input className="forminput" onChange={onChange} type={"text"} name="username" />
                    </div>
                    <div className="registration_field">
                        <label htmlFor="pass" >Password :</label>
                        <input className="forminput" onChange={onChange} type={"text"} name="pass" />
                    </div>
                    <div>
                        {error_messages}
                    </div>
                    <div>
                        <button id="loginbtn" className="button" type="submit" >Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}