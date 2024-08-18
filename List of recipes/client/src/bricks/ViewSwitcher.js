import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Icon from "@mdi/react";
import { mdiTable, mdiViewGridOutline } from "@mdi/js";

function ViewSwitcher({ viewType, setViewType, isFullDescription, setIsFullDescription }) {
    const isGrid = viewType === "grid";

    return (
        <Navbar bg="light">
            <div className="container-fluid d-flex align-items-center">
                <Navbar.Brand>Recipes list</Navbar.Brand>
                <div className="ms-auto d-flex">
                    <Button
                        variant="outline-primary"
                        onClick={() =>
                            setViewType((currentState) => {
                                return currentState === "grid" ? "table" : "grid";
                            })
                        }
                        className="me-2"
                    >
                        <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline} />{" "}
                        {isGrid ? "Table" : "Grid"}
                    </Button>
                    <Button
                        variant="outline-secondary"
                        onClick={() => setIsFullDescription(prevState => !prevState)}
                    >
                        {isFullDescription ? "Show Less" : "Show More"}
                    </Button>
                </div>
            </div>
        </Navbar>
    );
}

export default ViewSwitcher;
