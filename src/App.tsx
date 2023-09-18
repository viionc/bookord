import Navbar from "./components/Navbar";
import {ModalsProvider} from "./context/ModalsContext";
import {useFirebaseContext} from "./context/FirebaseContext";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import PageContent from "./components/PageContent";

function App() {
    const {dataLoaded} = useFirebaseContext();
    return (
        <ModalsProvider>
            <Navbar></Navbar>
            <LoginModal></LoginModal>
            <RegisterModal></RegisterModal>
            <PageContent></PageContent>
            {dataLoaded ? <></> : <></>}
        </ModalsProvider>
    );
}

export default App;
