import { useState } from "react";

const StatisticsLine = ({ text, value }) => {
  return (
    <td>
      {text} {value} {text === "positive" ? "%" : ""}
    </td>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  if (total === 0) {
    return (
      <>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </>
    );
  }

  const avg = total === 0 ? 0 : (good - bad) / total;
  const positive = total === 0 ? 0 : good / total;

  return (
    <>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr>
            <StatisticsLine text="good" value={good} />
          </tr>
          <tr>
            <StatisticsLine text="neutral" value={neutral} />
          </tr>
          <tr>
            <StatisticsLine text="bad" value={bad} />
          </tr>
          <tr>
            <StatisticsLine text="all" value={total} />
          </tr>
          <tr>
            <StatisticsLine text="average" value={avg} />
          </tr>
          <tr>
            <StatisticsLine text="positive" value={positive * 100} />
          </tr>
        </tbody>
      </table>
    </>
  );
};

const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={handleGoodClick}>good</Button>
      <Button onClick={handleNeutralClick}>neutral</Button>
      <Button onClick={handleBadClick}>bad</Button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
