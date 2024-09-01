import { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

export default function StudentGradeForm({ student, subject, show, setAddGradeShow }) {
  const [formData, setFormData] = useState({
    description: "",
    dateTs: new Date().toISOString().substring(0, 10),
    grade: null,
    weight: 1,
  });

  const handleClose = () => setAddGradeShow(false);

  const setField = (name, val) => {
    return setFormData((formData) => {
      const newData = { ...formData };
      newData[name] = val;
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const payload = {
      ...formData,
      studentId: student.id,
      subjectId: subject.id,
    };

    console.log(payload);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Add a grade</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Student: {student.firstname + " " + student.surname}</div>
            <div>Subject: {subject.name}</div>
            <br />
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={formData.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </Form.Group>

            <Row>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Grade</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="1-5"
                  value={formData.grade}
                  onChange={(e) => setField("grade", parseInt(e.target.value))}
                />
              </Form.Group>

              <Form.Group as={Col} className="mb-3">
                <Form.Label>Weight</Form.Label>
                <Form.Select
                  value={formData.weight}
                  onChange={(e) => setField("weight", Number(e.target.value))}
                >
                  <option value="" disabled>
                    Grade weight
                  </option>
                  <option value={0.5}>0.5</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateTs}
                onChange={(e) => setField("dateTs", e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex flex-row gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}