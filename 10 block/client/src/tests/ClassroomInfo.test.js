import ClassroomInfo from "../bricks/ClassroomInfo"
import { render, screen } from "@testing-library/react"

// Class test object for the ClassroomInfo component
const testClassroom = {
  name: "Test Classroom",
}

test("should render ClassroomInfo", () => {
  // Rendering the component to be tested
  render(<ClassroomInfo classroom={testClassroom} />)

  // Getting the element according to the test ID we added in the previous step
  const element = screen.getByTestId("classroom-title")

  // A method that expects the element to be on the page, if not, the test fails
  expect(element).toBeInTheDocument()
})

test("should render classroom name correctly", () => {
  render(<ClassroomInfo classroom={testClassroom} />)

  // Getting the element from the component to be tested
  const nameElement = screen.getByTestId("classroom-name")

  // Testing whether the element is on the page
  expect(nameElement).toBeInTheDocument()

  // Testing whether the element contains the correct text
  expect(nameElement.textContent).toBe(testClassroom.name)
})
