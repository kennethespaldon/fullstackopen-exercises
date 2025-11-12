const Notification = ({ message, status }) => {
  if (message === null) {
    return null;
  }
  const statusStyle = status === 'success' ? 'success' : 'fail';
  return (
    <div className={`${statusStyle}`}>
      {message}
    </div>
  )
};

export default Notification;