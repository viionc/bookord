import {UserProfile} from "../context/FirebaseContext";
import {useModalsContext} from "../context/ModalsContext";

function UserListComponent({user, color}: {user: UserProfile; color: string}) {
    const {handleModalReducer} = useModalsContext();
    return (
        <h5
            className="m-0 hover"
            key={user.uid}
            style={{color: color}}
            onClick={() => handleModalReducer({type: "USER_PROFILE", payload: user.uid})}
        >
            {user.displayName}
        </h5>
    );
}

export default UserListComponent;
