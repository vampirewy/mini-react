import React from "../core/React";

export function Todos() {
  const [inputValue, setInputValue] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [displayTodos, setDisplayTodos] = React.useState([]);
  const [todos, setTodos] = React.useState([]);

  React.useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos && setTodos(todos);
  }, []);

  React.useEffect(() => {
    if (filter === "all") {
      setDisplayTodos(todos);
    } else if (filter === "active") {
      const newTodos = todos.filter((todo) => todo.status === "active");
      setDisplayTodos(newTodos);
    } else if (filter === "done") {
      const newTodos = todos.filter((todo) => todo.status === "done");
      setDisplayTodos(newTodos);
    }
  }, [filter, todos]);

  function handleInput(e) {
    setInputValue(e.target.value);
  }

  function handleAdd() {
    addTodo(inputValue);
    setInputValue("");
  }

  function handleSave() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function createTodo(title) {
    return { title, id: crypto.randomUUID(), status: "active" };
  }

  function addTodo(title) {
    setTodos((todos) => [...todos, createTodo(title)]);
  }

  function removeTodo(id) {
    const newTodos = todos.filter((todo) => todo.id !== id);

    setTodos(newTodos);
  }

  function modifyTodoStatus(id, status) {
    return todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, status };
      }
      return todo;
    });
  }

  function doneTodo(id) {
    setTodos(modifyTodoStatus(id, "done"));
  }

  function cancelTodo(id) {
    setTodos(modifyTodoStatus(id, "active"));
  }

  function handleFilter(text) {
    setFilter(text);
  }

  return (
    <div>
      <h1>TODOS</h1>
      <div>
        <input type="text" value={inputValue} onInput={(e) => handleInput(e)} />
        <button onClick={handleAdd}>add</button>
        <button onClick={handleSave}>save</button>
      </div>

      <div>
        <input type="radio" name="filter" id="all" checked={filter === "all"} onChange={() => handleFilter("all")} />
        <label htmlFor="all">all</label>

        <input
          type="radio"
          name="filter"
          id="active"
          checked={filter === "active"}
          onChange={() => handleFilter("active")}
        />
        <label htmlFor="active">active</label>

        <input type="radio" name="filter" id="done" checked={filter === "done"} onChange={() => handleFilter("done")} />
        <label htmlFor="done">done</label>
      </div>

      <ul>
        {/* jsx 中解析不了数组，需要解构 */}
        {...displayTodos.map((todo) => {
          return (
            <li>
              <TodoItem todo={todo} removeTodo={removeTodo} cancelTodo={cancelTodo} doneTodo={doneTodo}></TodoItem>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TodoItem({ todo, removeTodo, cancelTodo, doneTodo }) {
  return (
    <div className={todo.status}>
      {todo.title}
      <button onClick={() => removeTodo(todo.id)}>remove</button>
      {todo.status === "done" ? (
        <button onClick={() => cancelTodo(todo.id)}>cancel</button>
      ) : (
        <button onClick={() => doneTodo(todo.id)}>done</button>
      )}
    </div>
  );
}
