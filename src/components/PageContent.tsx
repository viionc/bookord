import ChannelList from "./ChannelList";
import Feed from "./Feed";
import UserList from "./UserList";

export default function PageContent() {
    return (
        <div className="d-flex w-100" style={{height: "92vh"}}>
            <ChannelList></ChannelList>
            <Feed></Feed>
            <UserList></UserList>
        </div>
    );
}
