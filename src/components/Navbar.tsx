import {Button, Navbar as NavbarBs, Nav, Row} from "react-bootstrap";
import styles from "./Navbar.module.css";
import {useModalsContext} from "../context/ModalsContext";
// import {logoutUser} from "../Firebase";
import {useFirebaseContext} from "../context/FirebaseContext";

export default function Navbar() {
    const {openModal} = useModalsContext();
    const {currentUser, logoutUser, loginAnonymously} = useFirebaseContext();

    const logout = () => {
        logoutUser();
    };

    return (
        <Row className="w-100" style={{maxHeight: "7vh"}}>
            <NavbarBs className="bg-dark shadow-lg text-white p-1 fs-3 px-5">
                <Nav className="me-auto">Bookord</Nav>
                {!currentUser ? (
                    <>
                        <Button
                            className={`bg-primary me-2 lg ${styles.login}`}
                            onClick={() => openModal({key: "login"})}
                        >
                            Login
                        </Button>
                        <Button
                            className={`bg-danger me-2 ${styles.register}`}
                            onClick={() => openModal({key: "register"})}
                        >
                            Register
                        </Button>
                        <Button variant="warning" onClick={loginAnonymously}>
                            Login as Anon
                        </Button>
                    </>
                ) : (
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <p className="m-0">{currentUser.displayName}</p>
                        <Button
                            className={`bg-secondary me-2 lg ${styles.register}`}
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    </div>
                )}
            </NavbarBs>
        </Row>
    );
}
