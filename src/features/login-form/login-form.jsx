import {Button, Stack, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useAuthContext} from "@/context/auth-context.jsx";
import {useNavigate} from "react-router-dom";

export const LoginForm = () => {
  const {isAuth, onLogin} = useAuthContext();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/question");
    }
  }, []);

  return (
    <Stack direction={"column"} gap={2} alignItems={"center"} justifyContent={"center"} sx={{width: "100vw", height: "100dvh"}}>
      <Stack direction={"column"} maxWidth={"360px"} gap={2} sx={{width: "90%"}}>
        <Typography variant={"h1"} fontSize={"3rem"} fontWeight={600}>Login</Typography>
        <Typography fontSize={"0.8rem"}>Please enter your username so that we can recognize you while annotating. Make it simple and easily recognizable.</Typography>
        <TextField
          value={name}
          onChange={(e) => setName(e?.target?.value)}
          placeholder={"Enter name here"}
        />
        <Button variant={"contained"} onClick={() => onLogin(name)} disabled={!name}>
          Continue
        </Button>
      </Stack>
    </Stack>
  )
}