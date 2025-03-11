import {CircularProgress, Stack, Typography} from "@mui/material";

export const LoadingScreen = () => {
    return (
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={2}
               sx={{width: "100dw", height: "100dvh"}}>
            <Typography
                variant="body2"
                sx={{
                    color: "#252525", fontWeight: "500", fontSize: "14px", textAlign: "center",
                }}
            >
                Please wait until we fetch the questions for evaluation...
            </Typography>
            <CircularProgress/>
        </Stack>
    )
}