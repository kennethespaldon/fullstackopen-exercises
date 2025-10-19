import { useState } from "react";

const AnecdoteOfTheDay = ({ anecdotes, votes, selected }) => {
  return (
    <>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected]}</div>
      <p>has {votes[selected]} votes</p>
    </>
  );
};

const MostVotes = ({ anecdotes, votes }) => {
  let mostVotes = votes.indexOf(Math.max(...votes));
  let mostVotedAnecdote = anecdotes[mostVotes];

  return (
    <>
      <h2>Anecdotes with most votes</h2>
      <p>{mostVotedAnecdote}</p>
      <p>has {votes[mostVotes]} votes</p>
    </>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const handleVotes = () => {
    const copy = [...votes];
    copy[selected]++;
    setVotes(copy);
  };

  const handleRandomAnecdote = () => {
    const min = 0;
    const max = anecdotes.length - 1;
    setSelected(Math.floor(Math.random() * (max - min + 1) + min));
  };

  return (
    <>
      <AnecdoteOfTheDay
        anecdotes={anecdotes}
        votes={votes}
        selected={selected}
      />
      <button onClick={handleVotes}>vote</button>
      <button onClick={handleRandomAnecdote}>next anecdote</button>
      <MostVotes anecdotes={anecdotes} votes={votes} />
    </>
  );
};

export default App;
