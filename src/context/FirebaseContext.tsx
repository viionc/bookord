import {User} from "firebase/auth/cordova";
import {ReactNode, createContext, useContext, useEffect, useState} from "react";
import {initializeApp} from "firebase/app";
import {
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
    onSnapshot,
    query,
    increment,
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
    currentChannel: string;
    channels: Channel[];
    addNewChannel: (name: string) => void;
    changeChannel: (name: string) => void;
    clearChannel: () => void;
    likeMessage: (message: Message) => void;
    updateCurrentChannel: (messages: Message[]) => void;
    removeLikeMessage: (messages: Message) => void;
    currentUserProfile: UserProfile | null;
    userDatabase: UserProfile[];
    dataLoaded: boolean;
    addUserToFriends: (userUid: string) => void;
    removeUserFromFriends: (userUid: string) => void;
};

export type UserProfile = {
    displayName: string;
    uid: string;
    photoURL: string | null;
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
    const [currentChannel, setCurrentChannel] = useState<string>("general");
    const [userDatabase, setUserDatabase] = useState<UserProfile[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [currentUserProfile, setcurrentUserProfile] = useState<UserProfile | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);

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

    useEffect(() => {
        if (!currentUser) return;
        let q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, querySnapshot => {
            console.log("user data from database fetched");
            let users: UserProfile[] = [];
            querySnapshot.forEach(doc => users.push(doc.data() as UserProfile));
            setUserDatabase(users);
            let profile = users.filter(user => user.uid === currentUser.uid)[0];
            setcurrentUserProfile(profile);
        });
        return unsubscribe;
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return;
        const unsubscribe = onSnapshot(doc(db, "channels", currentChannel), doc => {
            console.log("channel data from database fetched");
            if (doc.exists()) {
                updateCurrentChannel(doc.data().messages as Message[]);
            }
        });
        return unsubscribe;
    }, [currentChannel, currentUser]);

    const registerUser = (email: string, password: string, username: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                updateProfile(userCredential.user, {
                    displayName: username,
                })
                    .then(() => setCurrentUser(userCredential.user))
                    .then(() => addUserToDatabase(createcurrentUserProfile(userCredential.user)));
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };

    const loginUser = (email: string, password: string): void | null => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => setCurrentUser(userCredential.user))
            .catch(error => {
                // const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
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

    const createcurrentUserProfile = (user: User): UserProfile => {
        const profile: UserProfile = {
            displayName: user.displayName || "",
            uid: user.uid,
            roles: ["member"],
            photoURL: user.photoURL,
            createdAt: Date.now(),
            totalMessagesSent: 0,
            friends: [],
            ignored: [],
        };
        return profile;
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
        setCurrentChannel(id);
    };

    function addUserToDatabase(user: UserProfile) {
        setDoc(doc(db, "users", user.uid), user);
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
                return users;
            })
            .then(users => {
                let profile = users.filter(user => user.uid === currentUser.uid)[0];
                setcurrentUserProfile(profile);
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
                });
            })
            .then(() => {
                setChannels(channels);
            })
            .then(() => setDataLoaded(true));
        // .then(() => {
        //     setCurrentChannel(channels.filter(e => e.id === "general")[0]);
        // });
    }

    const sendMessage = (message: Message) => {
        if (!currentUser) return;

        updateDoc(doc(db, "channels", currentChannel), {
            messages: arrayUnion({
                ...message,
            }),
        }).then(() => {
            updateDoc(doc(db, "users", currentUser.uid), {
                totalMessagesSent: increment(1),
            });
        });
    };

    const likeMessage = (message: Message) => {
        if (!currentUser) return;
        const messages = channels.filter(ch => ch.id === currentChannel)[0].messages;
        messages.forEach(msg => {
            if (msg.messageUid === message.messageUid) {
                msg.likes.push(currentUser.uid);
            }
        });
        updateDoc(doc(db, "channels", currentChannel), {
            messages: messages,
        });
    };

    const removeLikeMessage = (message: Message) => {
        if (!currentUser) return;
        const messages = channels.filter(ch => ch.id === currentChannel)[0].messages;
        messages.forEach(msg => {
            if (msg.messageUid === message.messageUid) {
                msg.likes = msg.likes.filter(uid => uid !== currentUser.uid);
            }
        });
        updateDoc(doc(db, "channels", currentChannel), {
            messages: messages,
        });
    };

    const addUserToFriends = (userUid: string) => {
        if (!currentUser || !currentUserProfile) return;
        const friends = [...currentUserProfile.friends];
        friends.push(userUid);
        updateDoc(doc(db, "users", currentUser.uid), {
            friends: friends,
        });
    };

    const removeUserFromFriends = (userUid: string) => {
        if (!currentUser || !currentUserProfile) return;
        let friends = currentUserProfile.friends.filter(e => e !== userUid);
        updateDoc(doc(db, "users", currentUser.uid), {
            friends: friends,
        });
    };

    const clearChannel = () => {
        if (!currentUser) return;
        updateDoc(doc(db, "channels", currentChannel), {
            messages: [],
        });
    };
    const updateCurrentChannel = (messages: Message[]) => {
        if (!currentUser) return;
        setChannels(prevChannels =>
            prevChannels.map(ch => {
                if (ch.id === currentChannel) {
                    ch.messages = messages;
                }
                return ch;
            })
        );
    };

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
                removeLikeMessage,
                currentUserProfile,
                userDatabase,
                dataLoaded,
                addUserToFriends,
                removeUserFromFriends,
            }}
        >
            {children}
        </FirebaseContext.Provider>
    );
}
