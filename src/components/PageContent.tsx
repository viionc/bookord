import {Row} from "react-bootstrap";
import {useFirebaseContext} from "../context/FirebaseContext";
import AddNewChannelModal from "./AddNewChannelModal";
import ChannelList from "./ChannelList";
import ChannelSettingsModal from "./ChannelSettingsModal";
import Feed from "./Feed";
import UserList from "./UserList";
import UserProfileModal from "./UserProfileModal";

export default function PageContent() {
    const {currentUser, dataLoaded} = useFirebaseContext();
    return currentUser ? (
        dataLoaded ? (
            <Row className="gap-1 h-100 mh-100">
                <ChannelList></ChannelList>
                <Feed></Feed>
                <UserList></UserList>
                <AddNewChannelModal></AddNewChannelModal>
                <UserProfileModal></UserProfileModal>
                <ChannelSettingsModal></ChannelSettingsModal>
            </Row>
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
    );
}
