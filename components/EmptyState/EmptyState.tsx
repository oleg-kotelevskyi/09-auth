import css from "./EmptyState.module.css";

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({
  message = "No notes found. Create your first one!",
}: EmptyStateProps) => {
  return (
    <div className={css.container}>
      <span className={css.icon}>📝</span>
      <p className={css.text}>{message}</p>
    </div>
  );
};

export default EmptyState;
