export default function User(props) {
    return (
        <div className="userbox">
            <div className="upper_user_box">
                {props.profile_image ? <img className="user_img" src={props.profile_image} alt="" /> : <div className="smallcircle"></div>}
                <div>
                    <h2>{props.username}</h2>
                    <p>{props.bio}</p>
                </div>
                <button className="button">Following</button>
            </div>
        </div>
    )
}