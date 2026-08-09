import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className={css.errorBlock} role="alert">
      <span className={css.icon}>⚠️</span>
      <p className={css.text}>{message}</p>
    </div>
  );
};

export default ErrorMessage;
