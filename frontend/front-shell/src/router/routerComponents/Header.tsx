import * as React from 'react';
import {useEffect, useState} from 'react';
import {alpha, createTheme, styled} from '@mui/material/styles';
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
import {Grid} from "@mui/material";
import {Link, useNavigate} from "react-router-dom"
import LoginModal from "../../components/login/LoginModal"
import {Cookies, useCookies} from "react-cookie";
import {UserI} from "../../utils/authRequests";
import {jwtDecode} from "jwt-decode";
import {Role} from "../routes/publicRoutes";

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
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const [loginOpen, setLoginOpen] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);
    const [searchArgs, setSearchArgs] = useState('');

    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies])

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

    const handleLogout = () => {
        const rigthCookie = new Cookies();
        console.log('Logout')
        rigthCookie.set('myselect_refresh', null, { expires: new Date(new Date().getTime() - 1000), domain: 'localhost', path: '/'})
        rigthCookie.set('myselect_access', null, { expires: new Date(new Date().getTime() - 1000), domain: 'localhost', path: '/'})
        setCurrentUser(null)
        setCookie('myselect_refresh', null, { expires: new Date(new Date().getTime() - 1000), domain: 'localhost', path: '/'})
        setCookie('myselect_access', null, { expires: new Date(new Date().getTime() - 1000), domain: 'localhost', path: '/'})
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
            {currentUser && <Link to={`/users/${currentUser.linkNickname}/profile`} style={{ textDecoration: 'none', color: 'inherit' }}><MenuItem sx={{fontWeight: 'bold'}}>{currentUser.email}</MenuItem></Link>}
            {currentUser && (currentUser.role == Role.ADMIN || currentUser.role == Role.MODERATOR) && <Link to={`/admin/reports`} style={{ textDecoration: 'none', color: 'inherit' }}><MenuItem>Reports</MenuItem></Link>}
            {currentUser && currentUser.role == Role.ADMIN && <Link to={`/admin/requests`} style={{ textDecoration: 'none', color: 'inherit' }}><MenuItem>Requests</MenuItem></Link>}
            {currentUser && <Link to={`/users/subscriptions`} style={{ textDecoration: 'none', color: 'inherit' }}><MenuItem>Subscriptions</MenuItem></Link>}
            {currentUser ?
                <MenuItem onClick={handleLogout} sx={{fontStyle: 'italic'}}>Logout&nbsp;<LogoutIcon fontSize={"small"}/></MenuItem> :
                <>
                    <MenuItem onClick={handleOpenLogin} sx={{fontStyle: 'italic'}}>Login&nbsp;<LogoutIcon fontSize={"small"}/></MenuItem>
                    <MenuItem><Link to={`/signup`} style={{ textDecoration: 'none', color: 'inherit' }}>Register</Link></MenuItem>
                </>
            }
        </Menu>
    );

    const handleSearchPosts = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            setTimeout(() => {location.reload()}, 0)
            return navigate(`/?args=${searchArgs}`)
        }
    }

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
                                <a href={'/'} style={{ textDecoration: 'none', color: '#000' }}>MYSELECT</a>
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
                                    onKeyDown={handleSearchPosts}
                                    inputProps={{'aria-label': 'search'}}
                                    value={searchArgs}
                                    onChange={(e) => setSearchArgs(e.target.value)}
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

