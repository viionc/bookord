import {ReactNode, createContext, useContext, useState} from "react";

type ModalsContextProps = {
    isLoginModalOpen: boolean;
    isRegisterModalOpen: boolean;
    isAddNewChannelModalOpen: boolean;
    // openLoginModal: () => void;
    // openRegisterModal: () => void;
    // closeLoginModal: () => void;
    // closeRegisterModal: () => void;
    openModal: (key: ModalKeys) => void;
    closeModal: (key: ModalKeys) => void;
};

const ModalsContext = createContext({} as ModalsContextProps);

export function useModalsContext() {
    return useContext(ModalsContext);
}

type ModalsProviderProps = {
    children: ReactNode;
};

type ModalKeys = "login" | "register" | "addnewchannel";

export function ModalsProvider({children}: ModalsProviderProps) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isAddNewChannelModalOpen, setIsAddNewChannelModalOpen] = useState(false);

    // const openLoginModal = () => setIsLoginModalOpen(true);
    // const openRegisterModal = () => setIsRegisterModalOpen(true);
    // const openAddNewChannelModalModal = () => setIsAddNewChannelModalOpen(true);
    // const closeLoginModal = () => setIsLoginModalOpen(false);
    // const closeRegisterModal = () => setIsRegisterModalOpen(false);
    // const closeAddNewChannelModalModal = () => setIsAddNewChannelModalOpen(false);

    const openModal = (key: ModalKeys) => {
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
        }
    };

    return (
        <ModalsContext.Provider
            value={{
                isLoginModalOpen,
                isRegisterModalOpen,
                isAddNewChannelModalOpen,
                openModal,
                closeModal,
                // openLoginModal,
                // openRegisterModal,
                // closeLoginModal,
                // closeRegisterModal,
                // openAddNewChannelModalModal,
                // closeAddNewChannelModalModal
            }}
        >
            {children}
        </ModalsContext.Provider>
    );
}
