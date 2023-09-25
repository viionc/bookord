import {ReactNode, createContext, useContext, useReducer} from "react";
import {Channel, Message} from "./FirebaseContext";

type ModalsContextProps = {
    modalState: ModalReducerState;
    handleModalReducer: (action: ModalAction) => void;
};

const ModalsContext = createContext({} as ModalsContextProps);

export function useModalsContext() {
    return useContext(ModalsContext);
}

type ModalsProviderProps = {
    children: ReactNode;
};

type ModalActionsTypes =
    | "LOGIN"
    | "REGISTER"
    | "ADD_NEW_CHANNEL"
    | "USER_PROFILE"
    | "CHANNEL_SETTINGS"
    | "DELETE_MESSAGE";

type ModalAction = {
    type: ModalActionsTypes;
    payload?: string | Channel | Message;
};

type ModalReducerState = {
    isLoginModalOpen: boolean;
    isRegisterModalOpen: boolean;
    isAddNewChannelModalOpen: boolean;
    isUserProfileModalOpen: boolean;
    isChannelSettingsModalOpen: boolean;
    isDeleteMessageModalOpen: boolean;
    profileUidClicked: string;
    messageUidClicked: string;
    channelClicked: Channel;
};

export function ModalsProvider({children}: ModalsProviderProps) {
    const MODALS_INITIAL_STATE: ModalReducerState = {
        isLoginModalOpen: false,
        isRegisterModalOpen: false,
        isAddNewChannelModalOpen: false,
        isUserProfileModalOpen: false,
        isChannelSettingsModalOpen: false,
        isDeleteMessageModalOpen: false,
        profileUidClicked: "",
        messageUidClicked: "",
        channelClicked: {
            name: "",
            members: [],
            owner: "",
            messages: [],
            role: "member",
            id: "",
            isPrivate: false,
        } as Channel,
    };

    function modalReducer(state: ModalReducerState, action: ModalAction) {
        const {type, payload} = action;
        switch (type) {
            case "LOGIN":
                return {
                    ...state,
                    isLoginModalOpen: !state.isLoginModalOpen,
                };
            case "REGISTER":
                return {
                    ...state,
                    isRegisterModalOpen: !state.isRegisterModalOpen,
                };
            case "CHANNEL_SETTINGS":
                return {
                    ...state,
                    isChannelSettingsModalOpen: !state.isChannelSettingsModalOpen,
                    channelClicked: payload as Channel,
                };
            case "ADD_NEW_CHANNEL":
                return {
                    ...state,
                    isAddNewChannelModalOpen: !state.isAddNewChannelModalOpen,
                };
            case "DELETE_MESSAGE":
                return {
                    ...state,
                    isDeleteMessageModalOpen: !state.isDeleteMessageModalOpen,
                    messageUidClicked: payload as string,
                };
            case "USER_PROFILE":
                return {
                    ...state,
                    isUserProfileModalOpen: !state.isUserProfileModalOpen,
                    profileUidClicked: payload as string,
                };
            default:
                return state;
        }
    }
    const [modalState, dispatch] = useReducer(modalReducer, MODALS_INITIAL_STATE);
    const handleModalReducer = (action: ModalAction) => {
        dispatch({type: action.type, payload: action.payload});
    };

    return (
        <ModalsContext.Provider
            value={{
                handleModalReducer,
                modalState,
            }}
        >
            {children}
        </ModalsContext.Provider>
    );
}
