import { Header } from "./components/Header";
import { Check, PlusCircle, Trash } from "phosphor-react";

import clipboardImg from "./assets/images/clipboard.png";

import "./styles/global.scss";
import styles from "./styles/App.module.scss";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import clsx from "clsx";
import { sort } from "fast-sort";

type TaskProps = {
  id: string;
  title: string;
  isCompleted: boolean;
};

type FormProps = {
  task: string;
};

function App() {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const { handleSubmit, register, reset } = useForm<FormProps>({
    defaultValues: {
      task: "",
    },
  });

  const onTaskCreation: SubmitHandler<FormProps> = useCallback((data) => {
    setTasks((oldTasks) => [
      ...oldTasks,
      { id: nanoid(), title: data.task, isCompleted: false },
    ]);
    window.localStorage.setItem("@Todo:tasks", JSON.stringify(tasks));
    reset();
  }, []);

  const handleChangeTaskToCompleted = useCallback((task: TaskProps) => {
    setTasks((oldTasks) =>
      oldTasks.map((t) => (t.id === task.id ? { ...t, isCompleted: true } : t))
    );
  }, []);

  const handleDeleteTask = useCallback((task: TaskProps) => {
    setTasks((oldTasks) => oldTasks.filter((t) => t.id !== task.id));
  }, []);

  useEffect(() => {
    const localStorageTasks = window.localStorage.getItem("@Todo:tasks");
    if (localStorageTasks) {
      setTasks(JSON.parse(localStorageTasks));
    }
  }, []);

  return (
    <>
      <Header />

      <section className={styles.wrapper}>
        <form
          onSubmit={handleSubmit(onTaskCreation)}
          className={styles.formWrapper}
        >
          <input
            type="text"
            placeholder="Adicione uma nova tarefa"
            className={styles.input}
            {...register("task", { required: true })}
          />
          <button type="submit" className={styles.submitButton}>
            <span>Criar</span>
            <PlusCircle size={16} />
          </button>
        </form>

        <section className={styles.tasksHeadingWrapper}>
          <header>
            <h4 className={styles.tasksHeading}>
              Parefas criadas <span>{tasks.length}</span>
            </h4>
            <h4 className={styles.tasksHeadingCompleted}>
              Concluídas{" "}
              <span>
                {tasks.filter((t) => t.isCompleted).length !== 0 ? (
                  <>
                    {tasks.filter((t) => t.isCompleted).length} de{" "}
                    {tasks.length}
                  </>
                ) : (
                  0
                )}
              </span>
            </h4>
          </header>
        </section>

        {tasks.length === 0 && (
          <section className={styles.noTasksWrapper}>
            <hr />

            <main>
              <img src={clipboardImg} alt="Clipboard image" />
              <h5>
                <strong>Você ainda não tem tarefas cadastradas</strong>
                <br />
                Crie tarefas e organize seus itens a fazer
              </h5>
            </main>
          </section>
        )}

        <main>
          {sort(tasks)
            .by([
              {
                asc: (t) => t.isCompleted,
              },
            ])
            .map((task) => (
              <section
                className={clsx(styles.taskWrapper, {
                  [styles.isCompleted]: task.isCompleted,
                })}
                key={task.id}
              >
                <button
                  className={styles.ctaToCompleteTask}
                  onClick={() => handleChangeTaskToCompleted(task)}
                >
                  <Check size={10} />
                </button>
                <p>{task.title}</p>
                <button
                  className={styles.ctaToDeleteTask}
                  onClick={() => handleDeleteTask(task)}
                >
                  <Trash size={14} />
                </button>
              </section>
            ))}
        </main>
      </section>
    </>
  );
}

export default App;
