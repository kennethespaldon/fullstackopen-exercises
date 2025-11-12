const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => (
  <div>
    {props.parts.map(part => <Part key={part.name} part={part}></Part>)}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p>total of {props.total} exercises</p>

const Course = ({ course }) => {
  const total = course.parts.reduce((sum, current) => sum + current.exercises, 0);;
  return (
    <>
      <Header course={course.name}/>
      <Content parts={course.parts} />
      <Total total={total} />
    </>
)};

const Courses = (props) => {
  return (
    <>
      {props.courses.map(course => <Course key={course.id} course={course}/>)}
    </>
  );
};

export default Courses;