import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import { useState } from 'react'
import RestoreIcon from '@mui/icons-material/Restore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocationOnIcon from '@mui/icons-material/LocationOn'

export default function Footer(){
    const [value, setValue] = useState<number>(0)

    return (
        <BottomNavigation
            showLabels
            sx={{ bottom: 0, width: '100%', position: 'absolute', borderTop: '1px black solid' }}
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue)
            }}
        >
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation>
    )
}
