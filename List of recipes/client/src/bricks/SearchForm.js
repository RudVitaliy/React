import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

function SearchForm({ setSearchBy }) {
    const [searchInput, setSearchInput] = useState("");

    function handleSearch(event) {
        event.preventDefault();
        setSearchBy(searchInput);
    }

    function handleInputChange(event) {
        setSearchInput(event.target.value);
        if (!event.target.value) {
            setSearchBy(""); 
        }
    }

    return (
        <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
                style={{ maxWidth: "150px" }}
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchInput}
                onChange={handleInputChange}
            />
            <Button
                style={{ marginLeft: "8px" }}
                variant="outline-success"
                type="submit"
            >
                <Icon size={1} path={mdiMagnify} />
            </Button>
        </Form>
    );
}

export default SearchForm;
