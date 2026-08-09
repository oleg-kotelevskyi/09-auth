import css from "./Loader.module.css";

interface LoaderProps {
  message?: string;
}

const Loader = ({ message = "Loading notes..." }: LoaderProps) => {
  return (
    <div className={css.container}>
      <div className={css.spinner} />
      <p className={css.text}>{message}</p>
    </div>
  );
};

export default Loader;
