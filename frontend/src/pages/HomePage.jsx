import { Text, Button, Box, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../services/api";
import TodoCard from "../components/TodoCard";

const HomePage = () => {
  const [todo, setTodo] = useState("");
  const [allTodos, setAllTodos] = useState({});

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todo");
      setAllTodos(res.data);
    } catch (error) {
      console.log("Error fetching todos: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTodos();
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/todo", { todo });
      setTodo("");
      await fetchTodos();
    } catch (error) {
      console.log("error adding todo: ", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} action="" method="post">
        <Box className="text-left mb-4">
          <Text>Todo</Text>
          <Input
            placeholder="Enter Todo"
            onChange={(e) => setTodo(e.target.value)}
          />
        </Box>

        <Button type="submit">ADD TODO</Button>
      </form>

      <Box>
        {allTodos.length > 0 ? (
          allTodos.map((todo) => (
            <TodoCard key={todo.id} data={todo} fetchData={fetchTodos} />
          ))
        ) : (
          <Text>No todos found.</Text>
        )}
      </Box>
    </div>
  );
};

export default HomePage;
