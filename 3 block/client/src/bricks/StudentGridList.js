import React from "react";
import Student from "./Student";

function StudentGridList(props) {
  return props.studentList.map((student) => {
    return <Student key={student.id} student={student} />;
  });
}

export default StudentGridList;
