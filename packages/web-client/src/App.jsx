import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import "./App.css";

function App() {
  const containerRef = useRef();
  const webSocket = useRef(new WebSocket("ws://localhost:8088")).current;

  const [data, setData] = useState([]);

  useEffect(() => {
    // Configure webSocket client
    webSocket.onopen = function onWebSocketConnection() {
      // Query this on connection
      handleInputQuery("fruits_in([carrot, apple, banana, broccoli], X).");

      webSocket.onmessage = function onMessageHandler(message) {
        const { data, query, error } = JSON.parse(message.data);

        if (error) {
          addData([
            {
              role: "query",
              value: query,
            },
            {
              role: "error",
              value: JSON.stringify(data),
            },
          ]);
        } else {
          addData([
            {
              role: "query",
              value: query,
            },
            ...data.map((answer) => ({
              role: "answer",
              value: answer,
            })),
          ]);
        }
      };
    };

    return () => webSocket.close();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }
  }, [data]);

  function addData(data) {
    setData((old) => [...old, ...data]);
  }

  async function handleInputQuery(queryText) {
    webSocket.send(queryText);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const { query } = event.target.elements;

    if (query.value) handleInputQuery(query.value);
    query.value = "";
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box
        ref={containerRef}
        sx={{
          p: 3,
          display: "flex",
          backgroundColor: "#FAFAFA",
          flexDirection: "column",
          flexGrow: 1,
          gap: 2,
          overflow: "auto",
        }}
      >
        {data.map((data, index) => (
          <Paper
            elevation={2}
            sx={{
              p: 2,
              overflow: "hidden",
              flexShrink: 0,
              ml: data.role === "query" ? 0 : 3,
            }}
            key={index}
            data-role={data.role}
          >
            <Typography variant={data.role === "query" ? "body1" : "body2"}>
              {data.role === "query" && ">>"} {data.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Divider />

      <form onSubmit={handleSubmit}>
        <Box sx={{ p: 3, display: "flex", gap: 3 }}>
          <TextField
            id="query"
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <Button variant="contained" type="submit">
            Query
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default App;
