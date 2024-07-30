import { Button, Box } from "@chakra-ui/react";
import api from "../services/api";

const TodoCard = ({ data, fetchData }) => {
  const deleteTask = async (e) => {
    e.preventDefault();
    await api.delete(`/todo/${data.id}`);
    await fetchData();
  };

  return (
    <Box className="flex gap-10">
      {data.task}
      <Button onClick={deleteTask} className="text-3xl" colorScheme="red">
        Delete
      </Button>
    </Box>
  );
};

export default TodoCard;
