import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {useAuthContext} from "@/context/auth-context.jsx";
import {IconLogout} from "@tabler/icons-react";


export const ThankYouPage = () => {
    const {onLogout} = useAuthContext();
    const navigate = useNavigate();

    const onLogoutButton = () => {
        onLogout();
        navigate('/login');
    }

    return (<>
            <Box sx={{
                position: 'fixed',
                top: 10,
                right: 10,
                zIndex: 999,
            }}>
                <Button
                    variant="outlined"
                    startIcon={<IconLogout size={13}/>}
                    onClick={onLogoutButton}
                    sx={{
                        borderRadius: 2,
                        bgcolor: "#f8f9fa",
                        color: "#252525",
                        "&:hover": {bgcolor: "#e1dfdf !important"},
                        fontSize: "12px",
                        padding: "5px 15px",
                    }}
                >
                    Logout
                </Button>
            </Box>
            <Grid container sx={{minHeight: '100vh', height: '100vh', p: {xs: 3, sm: 3, md: 5}}} justifyItems={'center'}
                  justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
                <Grid item maxWidth={"sm"} sx={{display: "flex", direction: "column", gap: 2}}>
                    <Stack direction={"column"} gap={2} alignItems={"center"}>
                        <Typography sx={{
                            fontSize: {xs: "1rem", sm: "1rem", md: "1rem", lg: "1.5rem"},
                            color: "secondary"
                        }} align={"center"}>
                            You have evaluated all questions!<br/> Thank you!
                        </Typography>
                        <Link to={"/question"}> Back to questions </Link>
                    </Stack>
                </Grid>
            </Grid>
        </>
    )
}