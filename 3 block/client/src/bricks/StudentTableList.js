import React from "react";
import Table from "react-bootstrap/Table";

function StudentTableList(props) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Jméno</th>
          <th>Příjmení</th>
          <th>Rodné číslo</th>
        </tr>
      </thead>
      <tbody>
        {props.studentList.map((student) => {
          return (
            <tr key={student.id}>
              <td>{student.firstname}</td>
              <td>{student.surname}</td>
              <td>{student.nationalId}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default StudentTableList;
