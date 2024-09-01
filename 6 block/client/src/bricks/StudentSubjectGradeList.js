import StudentGradeForm from "./StudentGradeForm";
import Icon from "@mdi/react";
import {
  mdiClipboardListOutline,
  mdiLoading,
  mdiWeight,
  mdiStar,
  mdiText,
  mdiCalendar,
  mdiPlus
} from "@mdi/js";
import { useState, useEffect, useMemo } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { getColorByGrade } from "../helpers/common";

function StudentSubjectGradeList({ student, subject }) {
  const [isModalShown, setShow] = useState(false);
  const [reload, setReload] = useState(false);
  const [addGradeShow, setAddGradeShow] = useState(false);
  const [studentSubjectGradeListCall, setStudentSubjectGradeListCall] =
    useState({
      state: "inactive",
    });

  const handleShowModal = () => setShow(true);

  const handleCloseModal = () => setShow(false);

  const handleAddGradeShow = () => setAddGradeShow(true);

  useEffect(() => {
    setStudentSubjectGradeListCall({ state: "pending" });

    async function fetchData() {
      const res = await fetch(
        `http://localhost:3000/grade/list?subjectId=${subject.id}&studentId=${student.id}`
      );
      const data = await res.json();

      if (res.status >= 400) {
        setStudentSubjectGradeListCall({ state: "error", error: data });
      } else {
        setStudentSubjectGradeListCall({ state: "success", data });
      }

      setReload(false);
    }

    if (isModalShown) fetchData();
  }, [isModalShown, student, subject, reload]);

  const average = useMemo(() => {
    if (studentSubjectGradeListCall.state === "success") {
      if (studentSubjectGradeListCall.data.length) {
        let gradeSum = 0;
        let weightSum = 0;
        studentSubjectGradeListCall.data.forEach((grade) => {
          gradeSum += grade.grade * grade.weight;
          weightSum += grade.weight;
        });
        if (gradeSum) return gradeSum / weightSum;
        else return "N";
      } else {
        return "N";
      }
    } else {
      return "N";
    }
  }, [studentSubjectGradeListCall.state, studentSubjectGradeListCall.data]);

  return (
    <>
      <Modal show={isModalShown} onHide={handleCloseModal} class={"hidden"}>
        <Modal.Header closeButton>
          <Modal.Title>Overview of grades</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <span className="text-muted">Student: </span>
              <b>{student.firstname + " " + student.surname}</b>
            </div>
            <div>
              <span className="text-muted">Subject: </span>
              <b>{subject.name}</b>
            </div>
            <div>
              <span className="text-muted">Average: </span>
              <b style={{ color: getColorByGrade(average) }}>{typeof average === 'number' ? average.toFixed(1) : average}</b>
            </div>
          </div>

          {studentSubjectGradeListCall.state === "pending" && (
            <div className="d-flex flex-column justify-content-center align-items-center mt-5 mb-5">
              <Icon size={2} path={mdiLoading} spin={true} />
            </div>
          )}

          {studentSubjectGradeListCall.state === "success" && (
            <div style={{ maxHeight: "55vh", overflow: "auto" }}>
              <Table className="mt-3" striped>
                <thead>
                  <tr>
                    <th style={{ width: "40px", color: "grey" }}>
                      <Icon size={1} path={mdiStar} />
                    </th>
                    <th style={{ width: "40px", color: "grey" }}>
                      <Icon size={1} path={mdiWeight} />
                    </th>
                    <th style={{ color: "grey" }}>
                      <Icon size={1} path={mdiText} />
                    </th>
                    <th style={{ width: "120px", color: "grey" }}>
                      <Icon size={1} path={mdiCalendar} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentSubjectGradeListCall.data.map((grade) => {
                    return (
                      <tr key={grade.id}>
                        <td
                          style={{
                            color: getColorByGrade(grade.grade),
                            textAlign: "center",
                          }}
                        >
                          <b>{grade.grade}</b>
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                          }}
                        >
                          {grade.weight}
                        </td>
                        <td>{grade.description}</td>
                        <td
                          style={{
                            textAlign: "center",
                          }}
                        >
                          {new Date(grade.dateTs).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
          {studentSubjectGradeListCall.state === "error" && (
            <div className="d-flex flex-column justify-content-center align-items-center mt-5 mb-5">
              <div>
                Failed to load{" "}
                <b>{student.firstname + " " + student.surname}</b> grade data from the course{" "}
                <b>{subject.name}</b>.
              </div>
              <br />
              <pre>
                {JSON.stringify(studentSubjectGradeListCall.error, null, 2)}
              </pre>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ float: "right" }}
            variant="secondary"
            class="btn btn-success btn-sm"
            onClick={handleAddGradeShow}
          >
            <Icon path={mdiPlus} size={1} />
            Add a grade
          </Button>
        </Modal.Footer>
      </Modal>

      <StudentGradeForm
        student={student}
        subject={subject}
        show={addGradeShow}
        setAddGradeShow={setAddGradeShow}
      />

      <Icon
        path={mdiClipboardListOutline}
        style={{ color: "grey", cursor: "pointer" }}
        size={1}
        onClick={handleShowModal}
      />
    </>
  );
}

export default StudentSubjectGradeList;