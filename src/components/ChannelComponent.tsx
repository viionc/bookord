import {Channel, useFirebaseContext} from "../context/FirebaseContext";
import {useModalsContext} from "../context/ModalsContext";
import styles from "./ChannelList.module.css";

const ChannelComponent: React.FC<Channel> = (channel: Channel) => {
    const {handleModalReducer} = useModalsContext();
    const {currentChannel, changeChannel, currentUserProfile} = useFirebaseContext();

    const handleOpenChannelSettings = (channel: Channel) => {
        handleModalReducer({type: "CHANNEL_SETTINGS", payload: channel});
    };

    const handleChannelClicked = (channel: Channel) => {
        if (channel.id === currentChannel) return;
        changeChannel(channel.id);
    };

    const checkIfCanSeeChannelSettingButton = (channel: Channel) => {
        if (!currentUserProfile) return false;
        if (
            currentUserProfile?.roles.includes("moderator") ||
            currentUserProfile?.roles.includes("admin")
        ) {
            return true;
        } else if (channel.owner === currentUserProfile.uid) {
            return true;
        }
    };
    return (
        <div
            className={` d-flex justify-content-between my-2 rounded px-3 hover ${
                channel.id === currentChannel ? styles.active : styles.inactive
            } ${styles.channelcomponent}`}
            onClick={() => handleChannelClicked(channel)}
        >
            <div className="">
                <h5 className={`m-0 hover`}>#{channel.name}</h5>
            </div>
            {currentUserProfile && checkIfCanSeeChannelSettingButton(channel) && (
                <div className="d-flex justify-content-end align-items-center">
                    <i
                        className="fa-solid fa-crown hover"
                        style={{color: "#f0cd6a", cursor: "pointer"}}
                        onClick={() => handleOpenChannelSettings(channel)}
                    ></i>
                </div>
            )}
        </div>
    );
};
export default ChannelComponent;
