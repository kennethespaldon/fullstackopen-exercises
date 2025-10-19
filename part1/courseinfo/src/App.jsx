const Header = ({ course }) => {
  return <h1>{course.name}</h1>;
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map((part) => (
        <Part key={part.name} part={part}></Part>
      ))}
    </div>
  );
};

const Total = ({ course }) => {
  const totalNumberOfExercises = course.parts.reduce(
    (total, part) => total + part.exercises,
    0
  );

  return <p>Number of exercises {totalNumberOfExercises}</p>;
};

const App = () => {
  const course = {
    name: "Half stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

export default App;
