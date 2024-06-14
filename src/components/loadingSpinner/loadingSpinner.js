import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import './loadingSpinner.css'

const LoadingSpinner = () => (
    <Box className="loading-container">
        <CircularProgress />
    </Box>
)

export default LoadingSpinner
