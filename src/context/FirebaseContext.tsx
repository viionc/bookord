import {User} from "firebase/auth/cordova";
import {createContext, useContext, useEffect, useState} from "react";
import {initializeApp} from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInAnonymously,
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
    deleteDoc,
} from "firebase/firestore";
import {v4 as uuid} from "uuid";
import filter from "leo-profanity";
import {
    Channel,
    Message,
    SaveChannelSettingsProps,
    FirebaseProviderProps,
    UserProfile,
    FirebaseContextProps,
} from "../utilities/types";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "socialbook-6872e.web.app",
    projectId: "socialbook-6872e",
    storageBucket: "socialbook-6872e.appspot.com",
    messagingSenderId: "771188516712",
    appId: "1:771188516712:web:de860f440603ffb23e98dd",
    measurementId: "G-HKZH7WT4QG",
};

const FirebaseContext = createContext({} as FirebaseContextProps);

export function useFirebaseContext() {
    return useContext(FirebaseContext);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db = getFirestore(app);

export function FirebaseProvider({children}: FirebaseProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentChannel, setCurrentChannel] = useState<string>("general");
    const [userDatabase, setUserDatabase] = useState<UserProfile[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [currentUserProfile, setcurrentUserProfile] = useState<UserProfile | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    var debounceTimeout: any;
    const DebounceDueTime = 500;

    useEffect(() => {
        const observer = auth.onAuthStateChanged(user => {
            if (debounceTimeout) clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                debounceTimeout = null;
                if (user) {
                    console.log("user logged in", new Date(Date.now()));
                    setCurrentUser(user);
                    loadDataFromDatabase(user);
                }
            }, DebounceDueTime);
        });
        return observer;
    }, []);

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
        let q = query(collection(db, "channels"));
        const unsubscribe = onSnapshot(q, querySnapshot => {
            console.log("channels data from database fetched");
            let newChannels: Channel[] = [];
            querySnapshot.forEach(doc => newChannels.push({id: doc.id, ...doc.data()} as Channel));
            setChannels(newChannels);
        });
        return unsubscribe;
    }, [currentUser]);

    function loadDataFromDatabase(user: User) {
        if (!user) return;
        const usersArray = [] as any[];
        const channelsArray = [] as any[];
        let channelsdb = getDocs(collection(db, "channels"))
            .then(data => {
                data.docs.forEach(doc => {
                    channelsArray.push({
                        id: doc.id,
                        ...doc.data(),
                    } as Channel);
                });
            })
            .then(() => {
                setChannels(channelsArray);
            });
        let userdb = getDocs(collection(db, "users"))
            .then(data => {
                data.docs.forEach(doc => {
                    usersArray.push({...doc.data()});
                });
            })
            .then(() => {
                setUserDatabase(usersArray);
            })
            .then(() => {
                let profile = usersArray.filter(u => u.uid === user.uid)[0];
                setcurrentUserProfile(profile);
            });

        Promise.all([userdb, channelsdb]).then(() => {
            setDataLoaded(true);
        });
    }

    const registerUser = (email: string, password: string, username: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                console.log("user created", new Date(Date.now()));
                updateProfile(userCredential.user, {
                    displayName: username,
                })
                    .then(() => setCurrentUser(userCredential.user))
                    .then(() => addUserToDatabase(createCurrentUserProfile(userCredential.user)));
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };

    const loginUser = (email: string, password: string): void | null => {
        signInWithEmailAndPassword(auth, email, password).catch(error => {
            // const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    };

    const loginAnonymously = () => {
        signInAnonymously(auth)
            .then(userCredential => {
                console.log("user created", new Date(Date.now()));
                updateProfile(userCredential.user, {
                    displayName: `anon-${Math.floor(Math.random() * 10000)}`,
                })
                    .then(() => setCurrentUser(userCredential.user))
                    .then(() => addUserToDatabase(createCurrentUserProfile(userCredential.user)));
            })
            .catch(error => {
                alert(error.errorMessage);
            });
    };

    const logoutUser = () => {
        if (!currentUser) return;
        signOut(auth)
            .then(() => {
                setCurrentUser(null);
                setChannels([]);
                setDataLoaded(false);
                setCurrentChannel("general");
                setcurrentUserProfile(null);
                setUserDatabase([]);
                console.log("logged out");
            })
            .catch(error => {
                console.log(error);
            });
    };

    const createCurrentUserProfile = (user: User): UserProfile => {
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

    const getUserByUid = (userUid: string): UserProfile => {
        return userDatabase.filter(u => u.uid === userUid)[0];
    };

    const changeChannel = (id: string) => {
        setCurrentChannel(id);
    };

    function addUserToDatabase(user: UserProfile) {
        setDoc(doc(db, "users", user.uid), user);
    }

    function addNewChannel(name: string, isPrivate: boolean) {
        if (!currentUser) return;
        const id = uuid();
        const newChannel: Channel = {
            id: id,
            isPrivate: isPrivate,
            name: name,
            owner: currentUser?.uid as string,
            role: "member",
            members: [currentUser?.uid as string],
            messages: [],
        };
        setDoc(doc(db, "channels", id), {
            ...newChannel,
        });
    }

    const sendMessage = (message: Message) => {
        if (!currentUser) return;
        message.body = filter.clean(message.body);
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

    const deleteMessage = (messageUid: string) => {
        if (!currentUser) return;
        const messages = channels
            .filter(ch => ch.id === currentChannel)[0]
            .messages.filter(m => m.messageUid !== messageUid);
        updateDoc(doc(db, "channels", currentChannel), {
            messages: messages,
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

    const saveChannelSettings = ({name, members, isPrivate, channel}: SaveChannelSettingsProps) => {
        if (!currentUser) return;
        setDoc(doc(db, "channels", channel.id), {
            ...channel,
            name,
            members,
            isPrivate,
        });
    };

    const deleteChannel = (channelId: string) => {
        deleteDoc(doc(db, "channels", channelId));
    };

    return (
        <FirebaseContext.Provider
            value={{
                currentUser,
                registerUser,
                loginUser,
                loginAnonymously,
                logoutUser,
                sendMessage,
                deleteMessage,
                channels,
                currentChannel,
                addNewChannel,
                changeChannel,
                clearChannel,
                likeMessage,
                removeLikeMessage,
                currentUserProfile,
                userDatabase,
                dataLoaded,
                addUserToFriends,
                removeUserFromFriends,
                getUserByUid,
                saveChannelSettings,
                deleteChannel,
            }}
        >
            {children}
        </FirebaseContext.Provider>
    );
}
