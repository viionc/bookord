import {ReactNode, createContext, useContext, useState} from "react";
import {Channel} from "./FirebaseContext";

type ModalsContextProps = {
    isLoginModalOpen: boolean;
    isRegisterModalOpen: boolean;
    isAddNewChannelModalOpen: boolean;
    isUserProfileModalOpen: boolean;
    isChannelSettingsModalOpen: boolean;
    profileUidClicked: string;
    channelClicked: Channel;
    openModal: ({}: ModalSettings) => void;
    closeModal: ({}: ModalSettings) => void;
};

const ModalsContext = createContext({} as ModalsContextProps);

export function useModalsContext() {
    return useContext(ModalsContext);
}

type ModalsProviderProps = {
    children: ReactNode;
};

type ModalSettings = {
    key: ModalKeys;
    channel?: Channel;
    profileClicked?: string;
};

type ModalKeys = "login" | "register" | "addnewchannel" | "userprofile" | "channelsettings";

export function ModalsProvider({children}: ModalsProviderProps) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isAddNewChannelModalOpen, setIsAddNewChannelModalOpen] = useState(false);
    const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
    const [isChannelSettingsModalOpen, setIsChannelSettingsModalOpen] = useState(false);
    const [profileUidClicked, setProfileUidClicked] = useState("");
    const [channelClicked, setChannelClicked] = useState<Channel>({} as Channel);

    const openModal = ({key, profileClicked, channel}: ModalSettings) => {
        switch (key) {
            case "login":
                setIsLoginModalOpen(true);
                break;
            case "register":
                setIsRegisterModalOpen(true);
                break;
            case "addnewchannel":
                setIsAddNewChannelModalOpen(true);
                break;
            case "userprofile":
                setProfileUidClicked(profileClicked as string);
                setIsUserProfileModalOpen(true);
                break;
            case "channelsettings":
                setChannelClicked(channel as Channel);
                setIsChannelSettingsModalOpen(true);
                break;
        }
    };

    const closeModal = ({key}: ModalSettings) => {
        switch (key) {
            case "login":
                setIsLoginModalOpen(false);
                break;
            case "register":
                setIsRegisterModalOpen(false);
                break;
            case "addnewchannel":
                setIsAddNewChannelModalOpen(false);
                break;
            case "userprofile":
                setIsUserProfileModalOpen(false);
                break;
            case "channelsettings":
                setIsChannelSettingsModalOpen(false);
                break;
        }
    };

    return (
        <ModalsContext.Provider
            value={{
                isLoginModalOpen,
                isRegisterModalOpen,
                isAddNewChannelModalOpen,
                isUserProfileModalOpen,
                isChannelSettingsModalOpen,
                profileUidClicked,
                channelClicked,
                openModal,
                closeModal,
            }}
        >
            {children}
        </ModalsContext.Provider>
    );
}
