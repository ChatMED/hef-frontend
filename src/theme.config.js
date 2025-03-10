import {createTheme} from '@mui/material';

const components = {
  MuiTextField: {
    styleOverrides: {
      root: {
        ".MuiOutlinedInput-root": {
          borderRadius: "8px !important",
          border: "0px !important",
          bgcolor: "background.main"
        },
      }
    }
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        // ".MuiOutlinedInput-root": {
        borderRadius: "8px !important",
        border: "0px !important",
        bgcolor: "background.main"
        // },
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "8px !important", // Applies 16px borderRadius to all buttons
        boxShadow: "0 !important",
        textTransform: "none"
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: "8px !important"
      }
    }
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        fontSize: "0.9rem"
      }
    }
  }
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#58A7BF',
      contrastText: '#EEEEEE',
    },
    secondary: {
      default: "#4d4d4d",
      main: "#4d4d4d",
      contrastText: "#edf0f7",
    },
    background: {
      default: '#FEFEFE',
      main: '#FEFEFE',
      dark: '#252525',
      paper: '#f8f7f7',
    },
    text: {
      primary: '#31363F',
      secondary: '#555555', // Add secondary text color
    },
  },
  typography: {
    allVariants: {
      color: '#31363F',
    },
    body1: {
      color: '#31363F',
    },
    body2: {
      color: '#555555',
    },
    // Add more typography variants as needed
  },
  components: {
    ...components,
    root: {
      background: "#fefefe"
    }
  }
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#58A7BF',
      contrastText: '#EEEEEE',
    },
    secondary: {
      main: "#fefefe",
      contrastText: "#4d4d4d",
    },
    background: {
      default: '#222831',
      main: '#222831',
      dark: "#fefefe",
      paper: '#31363F',
    },
    text: {
      primary: '#EEEEEE',
      secondary: '#BBBBBB', // Add secondary text color
    },
  },
  typography: {
    allVariants: {
      color: '#EEEEEE',
    },
    body1: {
      color: '#EEEEEE',
    },
    body2: {
      color: '#BBBBBB',
    },
    // Add more typography variants as needed
  },
  components: {
    ...components,
    root: {
      background: "#242424"
    }
  }
});
