import React from "react";
import Card from "react-bootstrap/Card";
import Icon from "@mdi/react";
import { mdiAccountSchoolOutline, mdiIdentifier } from "@mdi/js";

class Student extends React.Component {
  render() {
    return (
      <Card>
        <Card.Body>
          <div>
            <Icon path={mdiAccountSchoolOutline} size={1} color="grey" />{" "}
            {this.props.student.firstname} {this.props.student.surname}
          </div>
          <div>
            <Icon path={mdiIdentifier} size={1} color="grey" />{" "}
            {this.props.student.nationalId}
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default Student;
