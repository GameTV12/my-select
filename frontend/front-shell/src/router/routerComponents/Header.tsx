import * as React from 'react';
import {styled, alpha} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import {createTheme} from "@mui/material/styles";
import {Grid} from "@mui/material";
import {Link} from "react-router-dom"
import {useState} from "react";
import LoginModal from "../../components/login/LoginModal";

const mainTheme = createTheme({
    palette: {
        primary: {
            main: "#fff"
        },
    },
})

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    display: 'flex',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.07),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.14),
    },
    marginRight: '24px',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: '100%'

    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '100%',
        },
    },
}));

export default function Header() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const [loginOpen, setLoginOpen] = useState(false);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleOpenLogin = () => {
        setLoginOpen(true);
    }

    const handleCloseLogin = () => {
        setLoginOpen(false);
    }



    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <Link to={`/users/fake_id/profile`} style={{ textDecoration: 'none', color: 'inherit' }}><MenuItem sx={{fontWeight: 'bold'}}>User1234</MenuItem></Link>
            <MenuItem onClick={handleOpenLogin} sx={{fontStyle: 'italic'}}>Login&nbsp;<LogoutIcon fontSize={"small"}/></MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle/>
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar color={"default"} sx={{ backgroundColor: 'white', boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.5)' }} position="fixed">
                <Toolbar>
                    <Grid container>
                        <Grid xs={3}
                              container
                              direction="row"
                              alignItems="center"
                              justifyContent="center">
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{display: {xs: 'none', sm: 'inline-block', fontWeight: 'bold'}}}
                            >
                                <Link to={'/'} style={{ textDecoration: 'none', color: '#000' }}>MYSELECT</Link>
                            </Typography>


                        </Grid>
                        <Grid xs={6} container
                              direction="row"
                              alignItems="center">
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon/>
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search..."
                                    inputProps={{'aria-label': 'search'}}
                                />
                            </Search>
                        </Grid>
                        <Grid xs={3} container
                              direction="row"
                              justifyContent="space-around"
                              alignItems="center">
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{display: {xs: 'none', sm: 'inline-block'}, color: 'red'}}
                            >
                                <Link to={'/posts/create'} style={{ textDecoration: 'none', color: 'inherit' }}>Write a post</Link>
                            </Typography>
                            <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <AccountCircle/>
                                </IconButton>
                            </Box>
                            <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                                <IconButton
                                    size="large"
                                    aria-label="show more"
                                    aria-controls={mobileMenuId}
                                    aria-haspopup="true"
                                    onClick={handleMobileMenuOpen}
                                    color="inherit"
                                >
                                    <MoreIcon/>
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>

                </Toolbar>
            </AppBar>
            <LoginModal open={loginOpen} children={<></>} onClose={handleCloseLogin} />
            <Toolbar/>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );

}

