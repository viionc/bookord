import {Container, Button, Navbar as NavbarBs, Nav} from "react-bootstrap";
import styles from "./Navbar.module.css";
import {useModalsContext} from "../context/ModalsContext";
// import {logoutUser} from "../Firebase";
import {useFirebaseContext} from "../context/FirebaseContext";

export default function Navbar() {
    const {openModal} = useModalsContext();
    const {currentUser, logoutUser} = useFirebaseContext();

    const logout = () => {
        logoutUser();
    };

    return (
        <NavbarBs className="bg-success shadow-lg text-white p-3 fs-3" style={{height: "8vh"}}>
            <Container>
                <Nav className="me-auto">Bookord</Nav>
                {!currentUser ? (
                    <>
                        <Button
                            className={`bg-primary me-2 lg ${styles.login}`}
                            onClick={() => openModal("login")}
                        >
                            Login
                        </Button>
                        <Button
                            className={`bg-danger me-2 ${styles.register}`}
                            onClick={() => openModal("register")}
                        >
                            Register
                        </Button>
                    </>
                ) : (
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <p className="m-0">{currentUser.displayName}</p>
                        <Button className={`bg-danger me-2 lg ${styles.register}`} onClick={logout}>
                            Logout
                        </Button>
                    </div>
                )}
            </Container>
        </NavbarBs>
    );
}
