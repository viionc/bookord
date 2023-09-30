import {User} from "firebase/auth";
import {ReactNode} from "react";

export type FirebaseProviderProps = {
    children: ReactNode;
};

export type FirebaseContextProps = {
    currentUser: User | null;
    currentChannel: string;
    channels: Channel[];
    currentUserProfile: UserProfile | null;
    userDatabase: UserProfile[];
    dataLoaded: boolean;
    registerUser: (ussername: string, email: string, password: string, avatar: FileList | null) => Promise<any>;
    loginUser: (email: string, password: string) => void;
    loginAnonymously: () => void;
    logoutUser: () => void;
    sendMessage: (message: Message) => void;
    deleteMessage: (message: string) => void;
    addNewChannel: (name: string, isPrivate: boolean) => void;
    changeChannel: (name: string) => void;
    clearChannel: () => void;
    likeMessage: (message: Message) => void;
    removeLikeMessage: (messages: Message) => void;
    addUserToFriends: (userUid: string) => void;
    removeUserFromFriends: (userUid: string) => void;
    getUserByUid: (userUid: string) => UserProfile;
    saveChannelSettings: ({}: SaveChannelSettingsProps) => void;
    deleteChannel: (channelId: string) => void;
};

export type UserProfile = {
    displayName: string;
    uid: string;
    avatar: string | null;
    roles: UserRole[];
    createdAt: number;
    totalMessagesSent: number;
    friends: string[];
    ignored: string[];
};

export type UserRole = "member" | "moderator" | "admin";

export type Channel = {
    name: string;
    id: string;
    owner: string;
    messages: Message[];
    role: UserRole;
    members: string[];
    isPrivate: boolean;
};
export type Message = {
    username: string;
    userUid: string;
    messageUid: string;
    timestamp: number;
    body: string;
    likes: string[];
};
export type SaveChannelSettingsProps = {
    name: string;
    members: string[];
    isPrivate: boolean;
    channel: Channel;
};

export type ModalsProviderProps = {
    children: ReactNode;
};

export type ModalActionsTypes = "LOGIN" | "REGISTER" | "ADD_NEW_CHANNEL" | "USER_PROFILE" | "CHANNEL_SETTINGS" | "DELETE_MESSAGE" | "USER_SETTINGS";

export type ModalAction = {
    type: ModalActionsTypes;
    payload?: string | Channel | Message | null;
};

export type ModalReducerState = {
    isLoginModalOpen: boolean;
    isRegisterModalOpen: boolean;
    isAddNewChannelModalOpen: boolean;
    isUserProfileModalOpen: boolean;
    isChannelSettingsModalOpen: boolean;
    isDeleteMessageModalOpen: boolean;
    isUserSettingsModalOpen: boolean;
    profileUidClicked: string;
    messageUidClicked: string;
    channelClicked: Channel | null;
};

export type ModalsContextProps = {
    modalState: ModalReducerState;
    handleModalReducer: (action: ModalAction) => void;
};

export type SettingsAction = {
    type: SettingsActionTypes;
    payload?: string | FileList | null;
};
export type SettingsActionTypes =
    | "USERNAME"
    | "EMAIL"
    | "PASSWORD"
    | "CONFIRM_PASSWORD"
    | "AVATAR"
    | "RESET"
    | "OPEN_USERNAME_FORM"
    | "OPEN_AVATAR_FORM"
    | "OPEN_EMAIL_FORM"
    | "OPEN_PASSWORD_FORM";

export type SettingsReducerState = {
    username: string;
    avatar: FileList | null;
    password: string;
    confirmPassword: string;
    email: string;
    usernameActive: boolean;
    emailActive: boolean;
    passwordActive: boolean;
    avatarActive: boolean;
};
export type RegisterFormReducer = {
    username: string;
    avatar: FileList | null;
    password: string;
    confirmPassword: string;
    email: string;
    hasEnteredUsername: boolean;
    nameAlreadyExists: boolean;
    isEmailValid: boolean;
    hasEnteredPassword: boolean;
    emailAlreadyExists: boolean;
    isLoading: boolean;
};
export type RegisterFormAction = {
    type: RegisterFormActionTypes;
    payload: string | FileList | null | boolean;
    name: RegisterFormActionNames;
};
export type RegisterFormActionTypes = "INPUT" | "RESET" | "VALIDATE";
export type RegisterFormActionNames =
    | "username"
    | "email"
    | "password"
    | "confirmPassword"
    | "avatar"
    | "hasEnteredUsername"
    | "nameAlreadyExists"
    | "isEmailValid"
    | "hasEnteredPassword"
    | "emailAlreadyExists"
    | "reset"
    | "isLoading";
