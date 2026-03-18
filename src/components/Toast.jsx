/*
|--------------------------------------------------------------------------
| Toast Component
|--------------------------------------------------------------------------
| Displays temporary message
| Automatically disappears after 3 seconds
|--------------------------------------------------------------------------
*/

const Toast = ({ message, type }) => {
  return <div className={`toast toast-${type}`}>{message}</div>;
};

export default Toast;
