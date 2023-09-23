import Navbar from "./components/Navbar";
import {ModalsProvider} from "./context/ModalsContext";
import {useFirebaseContext} from "./context/FirebaseContext";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import PageContent from "./components/PageContent";
import {Container} from "react-bootstrap";

function App() {
    const {dataLoaded} = useFirebaseContext();
    return (
        <ModalsProvider>
            <Container
                fluid
                className="d-grid p-0 m-0 gap-1 h-100"
                style={{gridTemplateRows: "7vh auto"}}
            >
                <Navbar></Navbar>
                <LoginModal></LoginModal>
                <RegisterModal></RegisterModal>
                <PageContent></PageContent>
            </Container>
            {dataLoaded ? <></> : <></>}
        </ModalsProvider>
    );
}

export default App;
