import {useFirebaseContext} from "../context/FirebaseContext";
import ChannelList from "./ChannelList";
import Feed from "./Feed";
import UserList from "./UserList";

export default function PageContent() {
    const {currentUser, dataLoaded} = useFirebaseContext();
    return (
        <div className="d-flex w-100" style={{height: "92vh"}}>
            {currentUser ? (
                dataLoaded ? (
                    <>
                        <ChannelList></ChannelList>
                        <Feed></Feed>
                        <UserList></UserList>
                    </>
                ) : (
                    <div
                        className="h-100 w-100 d-flex justify-content-center align-items-center text-white"
                        style={{backgroundColor: "#313338"}}
                    >
                        <h1>Loading channels...</h1>
                    </div>
                )
            ) : (
                <div
                    className="h-100 w-100 d-flex justify-content-center align-items-center text-white"
                    style={{backgroundColor: "#313338"}}
                >
                    <h1>Login to see channels.</h1>
                </div>
            )}
        </div>
    );
}
