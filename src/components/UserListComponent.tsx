import {useModalsContext} from "../context/ModalsContext";
import {UserProfile} from "../utilities/types";
import userImage from "../assets/user.png";

function UserListComponent({user, color}: {user: UserProfile; color: string}) {
    const {handleModalReducer} = useModalsContext();
    return (
        <div className="d-flex h-100 align-items-center gap-1">
            <div>
                <img
                    className="rounded-circle"
                    src={user.avatar ? user.avatar : userImage}
                    height={32}
                    width={32}
                ></img>
            </div>
            <h5
                className="m-0 hover"
                style={{color: color}}
                onClick={() => handleModalReducer({type: "USER_PROFILE", payload: user.uid})}
            >
                {user.displayName}
            </h5>
        </div>
    );
}

export default UserListComponent;
