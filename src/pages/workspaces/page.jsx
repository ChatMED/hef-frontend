import {useEffect, useState} from "react";
import {getWorkspaces, selectWorkspace} from "@/services/workspaces.js";
import {useNavigate} from "react-router-dom";
import {Box, Stack, Typography} from "@mui/material";
import {Header} from "@/pages/header/page.jsx";

export const WorkspacesPage = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getWorkspaces()
            .then((response) => {
                setWorkspaces(response.data);
            })
    }, []);

    const onWorkspaceSelect = (workspaceId) => {
        selectWorkspace(workspaceId)
        navigate("/question")
    }

    return (
        <>
            <Header/>
            <Box
                sx={{
                    width: "100vw",
                    height: "100dvh",
                    backgroundColor: "whitesmoke",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "800px",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        padding: "2rem 2.5rem",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.06)"
                    }}
                >
                    <Stack spacing={2}>
                        <Typography variant="h1" fontSize="2.8rem" fontWeight={600}>
                            Workspaces
                        </Typography>
                        <Typography fontSize="0.8rem">
                            Please choose your workspace here.
                        </Typography>

                        {workspaces.map((it, index) => (
                            <Box
                                key={it.id}
                                onClick={() => onWorkspaceSelect(it.id)}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eaeaea")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f4")}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: "#f4f4f4",
                                    borderRadius: "10px",
                                    padding: "1.2rem 1.5rem",
                                    marginBottom: "1.5rem",
                                    cursor: "pointer",
                                    transition: "background 0.2s"
                                }}
                            >
                                <Box sx={{display: "flex", alignItems: "center", flex: 1}}>
                                    <Box
                                        sx={{
                                            width: "3rem",
                                            height: "3rem",
                                            backgroundColor: "#58A7BF",
                                            borderRadius: "5px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "700",
                                            fontSize: "0.95rem",
                                            color: "#fff",
                                            marginRight: "1.2rem",
                                            flexShrink: 0
                                        }}
                                    >
                                        W{index + 1}
                                    </Box>
                                    <Typography fontSize="1rem" fontWeight={500} color="#222">
                                        {it.name}
                                    </Typography>
                                </Box>
                                <Typography fontSize="0.9rem" fontWeight={500} color="#555" sx={{marginLeft: "auto"}}>
                                    Open →
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </>
    );
}