import {useState} from "react";
// import {Button} from "react-bootstrap";
import {useFirebaseContext} from "../context/FirebaseContext";
import {v4 as uuid} from "uuid";
import {User} from "firebase/auth";
// import EmojiPicker from "emoji-picker-react";
// import {Theme} from "emoji-picker-react";

export default function Feed() {
    const [messageBody, setMessageBody] = useState("");
    const {currentUser, sendMessage} = useFirebaseContext();

    const handleSend = () => {
        sendMessage({
            username: (currentUser as User).displayName || "anonymous",
            userUid: (currentUser as User).uid,
            messageUid: uuid(),
            body: messageBody,
            timestamp: Date.now(),
            likes: [],
        });
        setMessageBody("");
        (document.querySelector("#message-input") as HTMLInputElement).style.height = "5vh";
    };

    const checkKey = (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };
    const changeTextAreaSize = (e: any) => {
        if (messageBody === "") e.target.style.height = "5vh";
        if (e.target.scrollHeight <= 45 || e.target.scrollHeight > 500) return;
        e.target.style.height = "5vh";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    return (
        <div
            className="w-100 d-flex justify-content-center align-items-center flex-row"
            // style={{backgroundColor: "#313338"}}
        >
            <textarea
                id="message-input"
                className="w-100 rounded mb-2 overflow-hidden text-white"
                style={{backgroundColor: "rgb(62 64 68)", height: "5vh", resize: "none"}}
                onChange={e => setMessageBody(e.target.value)}
                onInput={e => changeTextAreaSize(e)}
                onKeyDown={e => checkKey(e)}
                value={messageBody}
                //disabled={currentUser ? false : true}
            ></textarea>
            {/* <EmojiPicker theme={Theme.DARK}></EmojiPicker> */}
            {/* <Button className="bg-secondary border-0 h-100" onClick={handleSend}>
                Send
            </Button> */}
        </div>
    );
}
