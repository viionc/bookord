import {Channel, useFirebaseContext} from "../context/FirebaseContext";
import {useModalsContext} from "../context/ModalsContext";
import styles from "./ChannelList.module.css";

const ChannelComponent: React.FC<Channel> = (channel: Channel) => {
    const {openModal} = useModalsContext();
    const {currentChannel, changeChannel, currentUserProfile} = useFirebaseContext();

    const handleOpenChannelSettings = (channel: Channel) => {
        openModal({key: "channelsettings", channel: channel});
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
            className={`d-flex flex-row align-items-center mb-2 rounded ps-3 pe-3 ${
                channel.id === currentChannel ? styles.active : styles.inactive
            }`}
        >
            <h5 className={`m-0 hover`} onClick={() => handleChannelClicked(channel)}>
                #{channel.name}
            </h5>
            {currentUserProfile && checkIfCanSeeChannelSettingButton(channel) && (
                <i
                    className="fa-solid fa-crown hover"
                    style={{color: "#f0cd6a", cursor: "pointer"}}
                    onClick={() => handleOpenChannelSettings(channel)}
                ></i>
            )}
        </div>
    );
};
export default ChannelComponent;
