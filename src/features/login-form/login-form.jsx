import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useAuthContext} from "@/context/auth-context.jsx";
import {useNavigate} from "react-router-dom";

export const LoginForm = () => {
    const {isAuth, onLogin} = useAuthContext();
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/workspaces");
        }
    }, []);

    return (<Box
            sx={{
                width: "100vw",
                height: "100dvh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "whitesmoke"
            }}
        >
            <Stack direction="column" maxWidth="360px" gap={2} sx={{width: "90%"}}>
                <Typography variant="h1" fontSize="3rem" fontWeight={600}>
                    Login
                </Typography>
                <Typography fontSize="0.8rem">
                    Please enter your username so that we can recognize you while annotating. Make it simple and easily
                    recognizable.
                </Typography>

                <form
                    autoComplete="off"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (name) onLogin(name);
                    }}
                >
                    <input type="text" name="fake-field" style={{display: "none"}} autoComplete="off"/>
                    <input type="password" name="fake-password" style={{display: "none"}} autoComplete="off"/>

                    <TextField
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your identifier"
                        inputMode="text"
                        autoComplete="off"
                        type="text"
                    />
                    <button type="submit" style={{display: "none"}}></button>
                </form>

                <Button
                    variant="contained"
                    onClick={() => onLogin(name)}
                    disabled={!name}
                >
                    Continue
                </Button>
            </Stack>
        </Box>);

}