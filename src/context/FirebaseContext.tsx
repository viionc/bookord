import {User} from "firebase/auth/cordova";
import {ReactNode, createContext, useContext, useEffect, useState} from "react";
import {initializeApp} from "firebase/app";
import {
    UserCredential,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import {
    arrayUnion,
    collection,
    doc,
    getDocs,
    getFirestore,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import {v4 as uuid} from "uuid";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "socialbook-6872e.web.app",
    projectId: "socialbook-6872e",
    storageBucket: "socialbook-6872e.appspot.com",
    messagingSenderId: "771188516712",
    appId: "1:771188516712:web:de860f440603ffb23e98dd",
    measurementId: "G-HKZH7WT4QG",
};

type FirebaseContextProps = {
    currentUser: User | null;
    registerUser: (ussername: string, email: string, password: string) => void;
    loginUser: (email: string, password: string) => void;
    logoutUser: () => void;
    sendMessage: (message: Message) => void;
    currentChannel: Channel;
    channels: Channel[];
    addNewChannel: (name: string) => void;
    changeChannel: (name: string) => void;
    clearChannel: () => void;
    likeMessage: (message: Message) => void;
    updateCurrentChannel: (messages: Message[]) => void;
    setCurrentChannel: Function;
    removeLikeMessage: (messages: Message) => void;
};

type UserProfile = {
    displayName: string;
    uid: string;
    photoURL: string | null;
    role: UserRole;
};

export type UserRole = "member" | "moderator" | "admin";

export type Channel = {
    name: string;
    id: string;
    owner: string;
    messages: Message[];
    role: UserRole;
    members: string[];
};
export type Message = {
    username: string;
    userUid: string;
    messageUid: string;
    timestamp: number;
    body: string;
    likes: string[];
};
const FirebaseContext = createContext({} as FirebaseContextProps);

export function useFirebaseContext() {
    return useContext(FirebaseContext);
}

type FirebaseProviderProps = {
    children: ReactNode;
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db = getFirestore(app);

// const blogPostsCollection = collection(db, "blogposts");

export function FirebaseProvider({children}: FirebaseProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentChannel, setCurrentChannel] = useState<Channel>({
        name: "general",
        id: "general",
        owner: "shtos",
        messages: [],
        role: "member",
        members: [],
    });
    const [, setUserDatabase] = useState<any[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);

    const registerUser = (email: string, password: string, username: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                updateProfile(userCredential.user, {
                    displayName: username,
                })
                    .then(() => addUserToDatabase(userCredential))
                    .then(() => setCurrentUser(userCredential.user));
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };

    const loginUser = (email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => setCurrentUser(userCredential.user))
            .then(() => {
                getMessages();
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(errorCode, errorMessage);
            });
    };

    const logoutUser = () => {
        if (!currentUser) return;
        signOut(auth)
            .then(() => {
                console.log("logged out");
            })
            .catch(error => {
                console.log(error);
            });
    };

    // const isLoggedIn = () => {
    //     return auth.currentUser ? true : false;
    // };

    // const getCurrentUser = () => {
    //     return auth.currentUser;
    // };

    // const getUserByUID = (uid: number) => {
    //     return;
    // };

    const changeChannel = (id: string) => {
        setCurrentChannel(channels.filter(channel => channel.id === id)[0]);
    };

    function addUserToDatabase(user: UserCredential) {
        if (!currentUser) return;
        const newUser: UserProfile = {
            displayName: user.user.displayName as string,
            uid: user.user.uid,
            photoURL: user.user.photoURL,
            role: "member",
        };
        setDoc(doc(db, "users", newUser.uid), {
            ...newUser,
        });
    }
    function addNewChannel(name: string) {
        if (!currentUser) return;
        const id = uuid();
        const newChannel: Channel = {
            id: id,
            name: name,
            owner: currentUser?.uid as string,
            role: "member",
            members: [currentUser?.uid as string],
            messages: [],
        };
        setDoc(doc(db, "channels", id), {
            ...newChannel,
        }).then(() => getMessages());
    }

    function getUsersFromDatabase() {
        if (!currentUser) return;
        const users = [] as any[];
        getDocs(collection(db, "users"))
            .then(data => {
                data.docs.forEach(doc => {
                    users.push({...doc.data()});
                });
                return users;
            })
            .then(users => {
                setUserDatabase(users);
            });
    }

    function getMessages() {
        if (!currentUser) return;
        const channels: Channel[] = [];
        getDocs(collection(db, "channels"))
            .then(data => {
                data.docs.forEach(doc => {
                    channels.push({
                        id: doc.id,
                        ...doc.data(),
                    } as Channel);
                    // if (doc.id == "general") {
                    //     messages.push(...doc.data().messages);
                    // }
                });
            })
            .then(() => {
                setChannels(channels);
            })
            .then(() => {
                setCurrentChannel(channels.filter(e => e.id === "general")[0]);
            });
    }

    const sendMessage = (message: Message) => {
        if (!currentUser) return;

        updateDoc(doc(db, "channels", currentChannel.id), {
            messages: arrayUnion({
                ...message,
            }),
        });
    };

    const likeMessage = (message: Message) => {
        if (!currentUser) return;
        const messages = currentChannel.messages;
        messages.forEach(msg => {
            if (msg.messageUid === message.messageUid) {
                msg.likes.push(currentUser.uid);
            }
        });
        updateDoc(doc(db, "channels", currentChannel.id), {
            messages: messages,
        });
    };

    const removeLikeMessage = (message: Message) => {
        if (!currentUser) return;
        const messages = currentChannel.messages;
        messages.forEach(msg => {
            if (msg.messageUid === message.messageUid) {
                msg.likes = msg.likes.filter(uid => uid !== currentUser.uid);
            }
        });
        updateDoc(doc(db, "channels", currentChannel.id), {
            messages: messages,
        });
    };

    const clearChannel = () => {
        if (!currentUser) return;
        updateDoc(doc(db, "channels", currentChannel.id), {
            messages: [],
        });
    };
    const updateCurrentChannel = (messages: Message[]) => {
        if (!currentUser) return;
        setChannels(prevChannels => {
            prevChannels.map(ch => {
                if (ch.id === currentChannel.id) {
                    ch.messages = messages;
                    setCurrentChannel(ch);
                }
                return ch;
            });
            return prevChannels;
        });
    };

    useEffect(() => {
        const observer = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user);
                getUsersFromDatabase();
                getMessages();
            } else {
                setCurrentUser(null);
                setChannels([]);
            }
        });
        return observer;
    }, [currentUser]);

    return (
        <FirebaseContext.Provider
            value={{
                currentUser,
                registerUser,
                loginUser,
                logoutUser,
                sendMessage,
                channels,
                currentChannel,
                addNewChannel,
                changeChannel,
                clearChannel,
                likeMessage,
                updateCurrentChannel,
                setCurrentChannel,
                removeLikeMessage,
            }}
        >
            {children}
        </FirebaseContext.Provider>
    );
}
