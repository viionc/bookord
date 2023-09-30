import {createContext, useContext, useReducer} from "react";
import {
    Channel,
    ModalAction,
    ModalReducerState,
    ModalsContextProps,
    ModalsProviderProps,
} from "../utilities/types";

const ModalsContext = createContext({} as ModalsContextProps);

export function useModalsContext() {
    return useContext(ModalsContext);
}

export function ModalsProvider({children}: ModalsProviderProps) {
    const MODALS_INITIAL_STATE: ModalReducerState = {
        isLoginModalOpen: false,
        isRegisterModalOpen: false,
        isAddNewChannelModalOpen: false,
        isUserProfileModalOpen: false,
        isChannelSettingsModalOpen: false,
        isDeleteMessageModalOpen: false,
        isUserSettingsModalOpen: false,
        profileUidClicked: "",
        messageUidClicked: "",
        channelClicked: null,
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
            case "USER_SETTINGS":
                return {
                    ...state,
                    isUserSettingsModalOpen: !state.isUserSettingsModalOpen,
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
