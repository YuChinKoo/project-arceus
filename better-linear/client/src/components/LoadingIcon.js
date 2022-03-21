import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function LoadingIcon() {
    return (
        <Box sx={{ display: 'flex', width: "100%", height: "100%", justifyContent: "center"}}>
            <CircularProgress />
        </Box>
    );
}