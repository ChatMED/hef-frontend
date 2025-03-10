import {Button, Grid, Stack, Typography} from "@mui/material";
import recordingCompletedLt from "../../assets/lottie/lottie_ella_recording_completed.json";
import Lottie from "lottie-react";
import {Link} from "react-router-dom";


export const ThankYouPage = () => {

    return (
        <Grid container sx={{minHeight: '100vh', height: '100vh', p: {xs: 3, sm: 3, md: 5}}} justifyItems={'center'}
              justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
            <Grid item maxWidth={"sm"} sx={{display: "flex", direction: "column", gap: 2}}>
                <Stack direction={"column"} gap={2} alignItems={"center"}>
                    <Lottie
                        animationData={recordingCompletedLt}
                        loop={false}
                        options={{
                            autoplay: true,
                            rendererSettings: {
                                preserveAspectRatio: "xMidYMid slice"
                            }
                        }}
                        height={400}
                        width={400}
                    />
                    <Typography sx={{
                        fontSize: {xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "2rem"},
                        color: "secondary",
                        fontWeight: 600
                    }} align={"center"}>
                        All your evaluations are now submitted!<br/> Thank you!
                    </Typography>
                    <Button variant={"contained"} sx={{color: "#fefefe !important"}} component={Link} to={"/question"}>
                        Answer Again
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    )
}