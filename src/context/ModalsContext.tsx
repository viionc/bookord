import {ReactNode, createContext, useContext, useState} from "react";

type ModalsContextProps = {
    isLoginModalOpen: boolean;
    isRegisterModalOpen: boolean;
    isAddNewChannelModalOpen: boolean;
    isUserProfileModalOpen: boolean;
    profileUidClicked: string;
    openModal: (key: ModalKeys, profileClicked?: string) => void;
    closeModal: (key: ModalKeys) => void;
};

const ModalsContext = createContext({} as ModalsContextProps);

export function useModalsContext() {
    return useContext(ModalsContext);
}

type ModalsProviderProps = {
    children: ReactNode;
};

type ModalKeys = "login" | "register" | "addnewchannel" | "userprofile";

export function ModalsProvider({children}: ModalsProviderProps) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isAddNewChannelModalOpen, setIsAddNewChannelModalOpen] = useState(false);
    const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
    const [profileUidClicked, setProfileUidClicked] = useState("");

    const openModal = (key: ModalKeys, profileClicked?: string) => {
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
        }
    };

    const closeModal = (key: ModalKeys) => {
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
        }
    };

    return (
        <ModalsContext.Provider
            value={{
                isLoginModalOpen,
                isRegisterModalOpen,
                isAddNewChannelModalOpen,
                isUserProfileModalOpen,
                profileUidClicked,
                openModal,
                closeModal,
            }}
        >
            {children}
        </ModalsContext.Provider>
    );
}
