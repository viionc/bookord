import {Row} from "react-bootstrap";
import {useFirebaseContext} from "../context/FirebaseContext";
import AddNewChannelModal from "../modals/AddNewChannelModal";
import ChannelList from "./ChannelList";
import ChannelSettingsModal from "../modals/ChannelSettingsModal";
import Feed from "./Feed";
import UserList from "./UserList";
import UserProfileModal from "../modals/UserProfileModal";
import DeleteMessageModal from "../modals/DeleteMessageModal";

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
                <DeleteMessageModal></DeleteMessageModal>
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
