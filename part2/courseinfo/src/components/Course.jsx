const Header = (props) => {
    return (
      <h2>{props.course.name}</h2>
    )
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    )
  }
  
  const Content = (props) => {
    return (
      <div>
        {props.parts.map(part => <Part key={part.id} part={part} />)}
      </div>
    )
  }
  
  const Total = (props) => {
    let exercises = props.parts.map(part => part.exercises)
    return (
      <p>
        <strong>
          Total of {exercises.reduce((sum, exercise) => sum + exercise, 0)} exercises
        </strong>
      </p>
    )
  }
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

export default Course