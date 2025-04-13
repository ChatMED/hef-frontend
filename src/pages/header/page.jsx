import {Box, Button} from "@mui/material";
import {IconLogout} from "@tabler/icons-react";
import {useAuthContext} from "@/context/auth-context.jsx";
import {useLocation, useNavigate} from "react-router-dom";

export const Header = () => {
    const {onLogout} = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    const onLogoutButton = () => {
        onLogout();
        navigate('/login');
    };

    const backToWorkspaces = () => {
        navigate('/workspaces');
    }

    if (location.pathname === "/login") return null;

    return (<Box
        sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            width: "100%",
            maxWidth: "1400px",
            pt: 1,
            pb: 1,
            px: 2,
            mx: "auto",
            position: "fixed",
            top: 8,
            left: 0,
            right: 0,
            zIndex: 10,
        }}
    >
        <Box/>
        <Box sx={{justifySelf: "end"}}>
            {location.pathname !== '/workspaces' && (<Button
                variant="outlined"
                startIcon={<IconLogout size={12}/>}
                onClick={backToWorkspaces}
                sx={{
                    borderRadius: 2,
                    border: "0.5px solid #B2527C",
                    bgcolor: "#f8f9fa",
                    color: "#252525",
                    "&:hover": {bgcolor: "#e1dfdf !important", border: "0.5px solid #B2527C"},
                    fontSize: "12px",
                    padding: "4px 10px",
                    marginX: "10px"
                }}
            >
                Back to Workspaces
            </Button>)}
            <Button
                variant="outlined"
                startIcon={<IconLogout size={12}/>}
                onClick={onLogoutButton}
                sx={{
                    borderRadius: 2,
                    border: "0.5px solid #58A7BF",
                    bgcolor: "#f8f9fa",
                    color: "#252525",
                    "&:hover": {bgcolor: "#e1dfdf !important"},
                    fontSize: "12px",
                    padding: "4px 10px",
                }}
            >
                Logout
            </Button>
        </Box>
    </Box>);
};
