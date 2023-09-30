import {User} from "firebase/auth/cordova";
import {createContext, useContext, useEffect, useState} from "react";
import {initializeApp} from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, signInAnonymously, signInWithEmailAndPassword, signOut, updateProfile} from "firebase/auth";
import {arrayUnion, collection, doc, getDocs, getFirestore, setDoc, updateDoc, onSnapshot, query, increment, deleteDoc} from "firebase/firestore";
import {v4 as uuid} from "uuid";
import filter from "leo-profanity";
import {Channel, Message, SaveChannelSettingsProps, FirebaseProviderProps, UserProfile, FirebaseContextProps} from "../utilities/types";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";

//setup your config here

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const FirebaseContext = createContext({} as FirebaseContextProps);

export function useFirebaseContext() {
    return useContext(FirebaseContext);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage();

export const db = getFirestore(app);

export function FirebaseProvider({children}: FirebaseProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentChannel, setCurrentChannel] = useState<string>("general");
    const [userDatabase, setUserDatabase] = useState<UserProfile[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [currentUserProfile, setcurrentUserProfile] = useState<UserProfile | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    // var debounceTimeout: any;
    // const DebounceDueTime = 500;

    useEffect(() => {
        const observer = auth.onAuthStateChanged(user => {
            // if (debounceTimeout) clearTimeout(debounceTimeout);
            // debounceTimeout = setTimeout(() => {
            //     debounceTimeout = null;
            if (user) {
                console.log("user logged in", new Date(Date.now()));
                setCurrentUser(user);
                loadDataFromDatabase(user);
            }
            // }, DebounceDueTime);
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

    useEffect(() => {
        const usersArray = [] as any[];
        getDocs(collection(db, "users")).then(docs => {
            docs.forEach(doc => {
                usersArray.push({...doc.data()});
            });
            setUserDatabase(usersArray);
        });
    }, []);

    const loadDataFromDatabase = async (user: User) => {
        const usersArray = [] as any[];
        let usersdb = await getDocs(collection(db, "users"));
        usersdb.forEach(doc => {
            usersArray.push({...doc.data()});
        });
        setUserDatabase(usersArray);
        if (!user) return;
        const channelsArray = [] as any[];
        let channelsdb = await getDocs(collection(db, "channels"));
        channelsdb.forEach(doc => {
            channelsArray.push({
                id: doc.id,
                ...doc.data(),
            } as Channel);
        });
        setChannels(channelsArray);
        let profile = usersArray.filter(u => u.uid === user.uid)[0];
        setcurrentUserProfile(profile);
        setDataLoaded(true);
    };

    const registerUser = async (email: string, password: string, username: string, avatar: FileList | null): Promise<any> => {
        let userCredential = null;
        try {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            return error;
        }
        await updateProfile(userCredential.user, {displayName: username});
        if (avatar) {
            const avatarRef = ref(storage, `avatars/${userCredential.user.uid}`);
            await uploadBytes(avatarRef, avatar[0]);
        }
        setCurrentUser(userCredential.user);
        const profile = await createCurrentUserProfile(userCredential.user, avatar);
        let addedProfile = await addUserToDatabase(profile);
        return addedProfile;
    };

    const loginUser = (email: string, password: string): void | null => {
        signInWithEmailAndPassword(auth, email, password).catch(error => {
            // const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    };

    const loginAnonymously = async () => {
        const userCredential = await signInAnonymously(auth);
        await updateProfile(userCredential.user, {
            displayName: `anon-${Math.floor(Math.random() * 10000)}`,
        });
        setCurrentUser(userCredential.user);
        const profile = await createCurrentUserProfile(userCredential.user, null);
        await addUserToDatabase(profile);
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

    const createCurrentUserProfile = async (user: User, avatar: FileList | null): Promise<UserProfile> => {
        let avatarURL = null;
        if (avatar) {
            avatarURL = await getAvatarURL(user.uid);
        }
        const profile: UserProfile = {
            displayName: user.displayName || "",
            uid: user.uid,
            roles: ["member"],
            avatar: avatarURL,
            createdAt: Date.now(),
            totalMessagesSent: 0,
            friends: [],
            ignored: [],
        };
        return profile;
    };

    const getAvatarURL = (userUid: string) => {
        let url = getDownloadURL(ref(storage, `avatars/${userUid}`));
        return url;
    };
    const getUserByUid = (userUid: string): UserProfile => {
        return userDatabase.filter(u => u.uid === userUid)[0];
    };

    const changeChannel = (id: string) => {
        setCurrentChannel(id);
    };

    const addUserToDatabase = (user: UserProfile) => {
        return setDoc(doc(db, "users", user.uid), user);
    };

    const addNewChannel = (name: string, isPrivate: boolean) => {
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
    };

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
        const messages = channels.filter(ch => ch.id === currentChannel)[0].messages.filter(m => m.messageUid !== messageUid);
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
