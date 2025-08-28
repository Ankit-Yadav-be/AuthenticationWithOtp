// src/pages/Notes.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  IconButton,
  useToast,
  Text,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import axiosInstance from "../utils/axiosInstance";
import { useUser } from "../context/userContext";

export default function Notes() {
  const toast = useToast();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "Untitled", content: "" });

  const { user, signOut } = useUser();

  // fetch notes
  const fetchNotes = async () => {
    try {
      const { data } = await axiosInstance.get("/notes");
      console.log(user)
      setNotes(data);
    } catch (err) {
      toast({ title: "Error fetching notes", status: "error" });
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // create note
  const handleSave = async () => {
    if (!form.title) {
      toast({ title: "Title required", status: "warning" });
      return;
    }
    try {
      const { data } = await axiosInstance.post("/notes", form);
      setNotes([...notes, data]);
      setForm({ title: "Untitled", content: "" });
      toast({ title: "Note created", status: "success" });
    } catch (err) {
      toast({ title: "Error saving note", status: "error" });
    }
  };

  // delete note
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
      toast({ title: "Note deleted", status: "info" });
    } catch (err) {
      toast({ title: "Error deleting note", status: "error" });
    }
  };

  return (
    <Box minH="100vh" bg="white" p="4">
      {/* Top Navbar */}
      <Flex justify="space-between" align="center" mb="6">
        <Text fontSize="xl">📝</Text>
        <Heading size="md">Dashboard</Heading>
        <Button variant="link" colorScheme="blue" onClick={signOut}>
          Sign Out
        </Button>
      </Flex>

      {/* Welcome Card */}
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p="6"
        mb="6"
        shadow="sm"
        bg="white"
      >
        <Text fontSize="lg" fontWeight="bold" mb="2">
          Welcome, {user?.name || "User"} !
        </Text>
        <Text color="gray.600">Email: {user?.email}</Text>
      </Box>

      {/* Create Note Button */}
      <Button
        colorScheme="blue"
        w="full"
        size="lg"
        borderRadius="md"
        mb="6"
        onClick={handleSave}
      >
        Create Note
      </Button>

      <Divider mb="4" />

      {/* Notes Section */}
      <Box>
        <Heading size="sm" mb="4">
          Notes
        </Heading>

        {notes.length === 0 ? (
          <Text color="gray.500">No notes yet. Create one!</Text>
        ) : (
          <VStack align="stretch" spacing="4">
            {notes.map((note) => (
              <Flex
                key={note._id}
                justify="space-between"
                align="center"
                borderWidth="1px"
                borderRadius="md"
                p="3"
                shadow="sm"
                bg="white"
              >
                <Text>{note.title}</Text>
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDelete(note._id)}
                />
              </Flex>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
}
