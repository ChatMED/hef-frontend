import {CircularProgress, Stack} from "@mui/material";

export const LoadingScreen = () => {
  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={2} sx={{width: "100dw", height: "100dvh"}}>
      <CircularProgress />
    </Stack>
  )
}