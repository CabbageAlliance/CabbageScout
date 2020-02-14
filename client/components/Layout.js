import Head from 'next/head'
import { AppBar, Container, CssBaseline, Toolbar, Typography } from "@material-ui/core"
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';

const theme = createMuiTheme({
    palette: {
        primary: teal,
        secondary: {
            main: '#ff1744',
        },
    },
});

export default function Layout(props) {
    return (
        <>
            <Head>
                <title>{props.title} - CabbageScout</title>
            </Head>

            <ThemeProvider theme={theme}>
                <CssBaseline />

                <AppBar position="relative">
                    <Toolbar>
                        <Typography variant="h6">
                            CabbageScout
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="sm">
                    {props.children}
                </Container>
            </ThemeProvider>
        </>
    )
}