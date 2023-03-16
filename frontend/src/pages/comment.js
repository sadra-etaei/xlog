import { useState } from "react"
import axios from "axios"
export default function Comment(props) {

    const [user, setUser] = useState("")
    const [prof, setProf] = useState("")

    axios.get(`/api/users/${props.user}`).then(response => {
        setUser(response.data)
        axios.get(`/api/profile/${response.data.profile}`).then(response => setProf(response.data))
    }
    )

    // axios.get(`/api/profile/${user.profile}`.then(response => setProf(response.data)))

    return (
        <div className="comment">
            <div>
                <img className="comment_box_profile_img" src={prof.profile_image} alt="" />
                <h2>{user.username}</h2>
                <p>{props.date}</p>
            </div>
            <p>{props.text}</p>
        </div>
    )
}