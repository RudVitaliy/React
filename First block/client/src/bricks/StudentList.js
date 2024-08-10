import React from "react";
import Student from "./Student";

function StudentList(props) {
    function getStudentList(studentList) {
        return studentList?.map((student) => {
            return <Student key={student.id} student={student} />;
        });
    }
    return getStudentList(props.studentList);
}


export default StudentList;