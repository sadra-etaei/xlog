import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export default function SignUp() {
    const [form, setForm] = useState({})
    const [error, setError] = useState([])
    const navigate = useNavigate()
    function handleChange(event) {
        validateForm()
        if (event.target.name === "username") {
            setForm(prevForm => { return { ...prevForm, username: event.target.value } })
        }
        if (event.target.name === "email") {
            setForm(prevForm => { return { ...prevForm, email: event.target.value } })
        }
        if (event.target.name === "pass") {
            setForm(prevForm => { return { ...prevForm, password: event.target.value } })
        }
        if (event.target.name === "pass2") {
            setForm(prevForm => { return { ...prevForm, "password_confirmation": event.target.value } })
        }
    }
    function postForm(event) {
        event.preventDefault()
        console.log(JSON.stringify(form))
        console.log(error)

        if (error == "") {
            axios.post("/api/users/signup", form, {
                "headers": {
                    'Content-Type': 'application/json',
                }
            }).then(response => console.log(response)).then(navigate('/login'))
        }


    }
    function validateForm() {

        if (form.username == null) {
            setError(["please fill out the blanks"])
        }
        else if (form.email == null) {
            setError(["please fill out the blanks"])

        }
        else if (form.password == null) {
            setError(["please fill out the blanks"])

        }
        else if (form.password_confirmation == null) {
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
        else if ((form.email.includes("@") === false) || (form.email.includes(".") === false)) {
            setError(prev => {
                if (error.includes("the email is not correct") === false) {
                    return [...prev, "the email is not correct"]
                }
                else {
                    return [...prev]
                }
            })

            // setError("enter a correct email")
        }
        else if (form.password_confirmation != form.password) {
            setError(prev => {
                if (error.includes("the passwords do not match") === false) {
                    return [...prev, "the passwords do not match"]
                }
                else {
                    return [...prev]
                }
            })

            // setError("the passwords do not match")
        }
        else {
            setError("")
        }
    }

    var error_messages = ""
    if (error != "") {
        error_messages = error.map(e => <p id="error_message">{e}</p>)
    }


    return (
        <div>
            <div id="signup_form" className="registration_formbox">
                <h1>Signup</h1>
                <form method="post" onSubmit={postForm}>

                    <div className="registration_field">
                        <label for="username" >Username : </label>
                        <input className="forminput" type={"text"} name="username" id={"userinput"} onChange={handleChange} />
                    </div>

                    <div className="registration_field">
                        <label for="email" >Email : </label>
                        <input className="forminput" name="email" type={"email"} id={"emailinput"} onChange={handleChange} />
                    </div>

                    <div className="registration_field">
                        <label for="pass" >Password :</label>
                        <input className="forminput" name="pass" type={"password"} onChange={handleChange} />
                    </div>

                    <div className="registration_field">
                        <label for="pass2" >Confirm your password : </label>
                        <input className="forminput" name="pass2" type={"password"} onChange={handleChange} />
                    </div>

                    <div className="errors_parent">
                        {error_messages}
                    </div>

                    <button id="signupbtn" className="button" type="submit"  >Signup</button>
                </form>
            </div>
        </div>
    )
}