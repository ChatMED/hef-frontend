import {Grid, Stack, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {Header} from "@/pages/header/page.jsx";

export const ThankYouPage = () => {
    return (
        <>
            <Header/>
            <Grid
                container
                sx={{minHeight: '100vh', height: '100vh', p: {xs: 3, sm: 3, md: 5}}}
                justifyItems={'center'}
                justifyContent={'center'}
                alignItems={'center'}
                alignContent={'center'}
            >
                <Grid item maxWidth={"sm"} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                    <Stack direction={"column"} gap={2} alignItems={"center"}>
                        <Typography
                            sx={{
                                fontSize: {xs: "1rem", sm: "1rem", md: "1rem", lg: "1.5rem"},
                                color: "secondary",
                            }}
                            align={"center"}
                        >
                            You have evaluated all questions for this workspace!<br/> Thank you!
                        </Typography>
                        <Link to={"/question"}>Back to questions</Link>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );

}