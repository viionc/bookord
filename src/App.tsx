import Navbar from "./components/Navbar";
import {ModalsProvider} from "./context/ModalsContext";
import {FirebaseProvider} from "./context/FirebaseContext";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import PageContent from "./components/PageContent";
import AddNewChannelModal from "./components/AddNewChannelModal";

function App() {
    return (
        <FirebaseProvider>
            <ModalsProvider>
                <Navbar></Navbar>
                <PageContent></PageContent>
                <LoginModal></LoginModal>
                <RegisterModal></RegisterModal>
                <AddNewChannelModal></AddNewChannelModal>
            </ModalsProvider>
        </FirebaseProvider>
    );
}

export default App;
