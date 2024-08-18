import React from "react";
import styles from "../css/classroom.module.css";

class ClassroomInfo extends React.Component {
  render() {
    return (
      <h1>
        Classroom{" "}
        <span className={styles.classroomNameHeader}>
          {this.props.classroom.name}
        </span>
      </h1>
    );
  }
}

export default ClassroomInfo;
