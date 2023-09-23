import {Col} from "react-bootstrap";
import {Channel, useFirebaseContext} from "../context/FirebaseContext";
import {useModalsContext} from "../context/ModalsContext";
import ChannelComponent from "./ChannelComponent";

export default function ChannelList() {
    const {channels, currentUserProfile} = useFirebaseContext();
    const {openModal} = useModalsContext();

    const handleAddChannel = () => {
        openModal({key: "addnewchannel"});
    };

    const checkIfUserCanSeeChannel = (channel: Channel) => {
        if (!currentUserProfile) return false;
        if (!channel.isPrivate) return true;
        if (
            currentUserProfile?.roles.includes("moderator") ||
            currentUserProfile?.roles.includes("admin")
        ) {
            return true;
        } else if (channel.members.includes(currentUserProfile.uid)) {
            return true;
        }
    };

    return (
        <Col
            xs={4}
            id="channel-list"
            className={`text-secondary mh-100 position-relative `}
            style={{backgroundColor: "rgb(42 43 49)", flex: "0 0 300px"}}
        >
            {/* <Button
                className="position-absolute bg-dark text-white fs-5 d-flex justify-content-center align-items-center"
                style={{top: "25%", left: 5, height: 30, width: 30}}
                onClick={() => setHide(!hide)}
            >
                {"<"}
            </Button> */}
            <div className="text-white d-flex justify-content-between align-items-center">
                <div className="fs-5">Text Channels</div>
                <div
                    className="fs-1 d-flex justify-content-end align-items-center"
                    style={{cursor: "pointer"}}
                    onClick={handleAddChannel}
                >
                    <span>+</span>
                </div>
            </div>
            <div id="channels" className="px-4 mh-100 overflow-auto" style={{height: "80vh"}}>
                {channels.map(channel => {
                    if (
                        channel.id === "moderator" &&
                        currentUserProfile?.roles.includes("moderator")
                    )
                        return <ChannelComponent key={channel.id} {...channel}></ChannelComponent>;
                })}
                {channels.map(channel => {
                    if (currentUserProfile && channel.id === "general")
                        return <ChannelComponent key={channel.id} {...channel}></ChannelComponent>;
                })}

                {channels.map(channel => {
                    if (channel.id === "general" || channel.id === "moderator") return;
                    if (currentUserProfile && checkIfUserCanSeeChannel(channel)) {
                        return <ChannelComponent key={channel.id} {...channel}></ChannelComponent>;
                    }
                })}
            </div>
        </Col>
    );
}
