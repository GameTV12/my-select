import React, {useEffect, useMemo, useRef, useState} from 'react';
import {mockRealSubscribers, mockSubscribers} from "../mockData/mockSubscribers";
import {
    Avatar,
    Box, ClickAwayListener,
    Grid, Grow, IconButton, MenuItem, MenuList,
    Paper, Popper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Toolbar,
    Typography
} from "@mui/material"
import {Link} from "react-router-dom"
import ModeratorRequestModal from "../components/ModeratorRequestModal";
import DeleteModal from "../components/DeleteModal";
import LogoutModal from "../components/LogoutModal";
import {Line} from "react-chartjs-2"
import {Chart as ChartJS, ChartEvent, registerables} from 'chart.js';

ChartJS.register(...registerables)
import 'chartjs-plugin-annotation'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import UserCommentList from "../components/UserCommentList";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {findUserByNickname} from "../utils/publicRequests";
import {useCookies} from "react-cookie";
import {jwtDecode} from "jwt-decode";
import {Role, UserI} from "../utils/axiosInstance";

export interface User {
    firstName: string
    lastName: string
    nickname: string
    linkNickname: string
    photo: string
    birthday: Date
    createdAt: Date
    secondVerification: boolean
    _count: {
        Followers: number
    }
    commentNumber: number
    postNumber: number
}

export type SubscriberStatistics = {
    time: number
    subscribers: number
}

const mockUser = {
    firstName: 'Not',
    lastName: 'Found',
    nickname: 'notfounduser',
    linkNickname: 'notfounduser',
    photo: 'https://i.pinimg.com/originals/b6/b5/99/b6b59960f63c54ef78bf0f10d72c7218.jpg',
    birthday: new Date('1998-09-03').getTime(),
    createdAt: new Date('2020-11-01').getTime(),
    secondVerification: false,
    _count: {
        Followers: 999
    },
    postNumber: 999,
    commentNumber: 999,
}

const UserInfoPage = () => {
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const { id } = useParams()
    useEffect(() => {
        let response;
        if (id != undefined) {
            findUserByNickname(id).then(r => {setUserInfo(r)}).catch(r => {
                return <Navigate replace to={'/'} />
            })
        }
    }, [id]);

    const [openAddMenu, setOpenAddMenu] = useState<boolean>(false)
    const [openModalModeratorRequest, setOpenModalModeratorRequest] = useState<boolean>(false)
    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
    const [openModalLogout, setOpenModalLogout] = useState<boolean>(false)
    const [tabPosition, setTabPosition] = useState<string>('1');
    const [userInfo, setUserInfo] = useState(mockUser);
    const [chartSubscriberData, setChartSubscriberData] = useState({
        labels: mockSubscribers.map((data) => (`${new Date(data.time).getDate()}.${new Date(data.time).getMonth() + 1}.${new Date(data.time).getFullYear()}`)),
        type: "line",
        datasets: [{
            label: "Subscribers",
            data: mockSubscribers.map((data) => data.subscribers),
            backgroundColor: 'blue',
        }, {
            label: "Verified subscribers",
            data: mockRealSubscribers.map((data) => data.subscribers),
            backgroundColor: 'lightgreen',
        }],
        options: {
            responsive: true,
            interaction: {
                intersect: false,
                mode: "index"
            },
        },
    })
    const chart = useMemo(() => {
        // @ts-ignore
        return <Line data={chartSubscriberData} options={chartSubscriberData.options}/>
    }, [mockSubscribers, mockRealSubscribers])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);

    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies])

    // // @ts-ignore
    // const chart = <Line data={chartSubscriberData} options={chartSubscriberData.options}/>

    const anchorRef = useRef<HTMLButtonElement>(null);

    const handleAddMenuToggle = () => {
        setOpenAddMenu((prevOpen) => !prevOpen);
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabPosition(newValue)
    }

    const handleAddMenuClose = (event: Event | React.SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpenAddMenu(false);
    }

    const handleOpenModalModeratorRequest = (event: Event | React.SyntheticEvent) => {
        setOpenModalModeratorRequest(true)
        handleAddMenuClose(event)
    };
    const handleCloseModalModeratorRequest = () => {
        setOpenModalModeratorRequest(false);
    }

    const handleOpenModalDelete = (event: Event | React.SyntheticEvent) => {
        setOpenModalDelete(true)
        handleAddMenuClose(event)
    };
    const handleCloseModalDelete = () => {
        setOpenModalDelete(false);
    }

    const handleOpenModalLogout = (event: Event | React.SyntheticEvent) => {
        setOpenModalLogout(true)
        handleAddMenuClose(event)
    };
    const handleCloseModalLogout = () => {
        setOpenModalLogout(false);
    }


    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenAddMenu(false);
        } else if (event.key === 'Escape') {
            setOpenAddMenu(false);
        }
    }

    // @ts-ignore
    return (
        <Grid container justifyContent="center" sx={{mt: '20px', mb: '10px'}}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                <TableContainer component={Paper}>
                    <Toolbar
                        sx={{
                            pl: {sm: 2},
                            pr: {xs: 1, sm: 1},
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Avatar>
                                <Box component={"img"} src={userInfo.photo} sx={{objectFit: 'cover'}} minWidth={'100%'}
                                     minHeight={'100%'}/>
                            </Avatar>
                            <Typography sx={{px: 2}}>{userInfo.nickname} (<i><Link to={`/users/${userInfo.linkNickname}`} style={{ textDecoration: 'none' }}>{userInfo.linkNickname}</Link></i>)</Typography>
                        </Box>
                        <IconButton aria-label="settings"
                                    ref={anchorRef}
                                    id="composition-button"
                                    aria-controls={openAddMenu ? 'composition-menu' : undefined}
                                    aria-expanded={openAddMenu ? 'true' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleAddMenuToggle}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                        </IconButton>
                        <Popper
                            open={openAddMenu}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            placement="bottom-start"
                            transition
                            disablePortal
                        >
                            {({TransitionProps, placement}) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom-start' ? 'left top' : 'left bottom',
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleAddMenuClose}>
                                            <MenuList
                                                autoFocusItem={openAddMenu}
                                                id="composition-menu"
                                                aria-labelledby="composition-button"
                                                onKeyDown={handleListKeyDown}
                                            >
                                                {currentUser && currentUser.linkNickname==userInfo.linkNickname && <MenuItem onClick={handleAddMenuClose}><Link to={`/users/update`} style={{ textDecoration: 'none', color: "inherit" }}>Edit the profile</Link></MenuItem>}
                                                {currentUser && currentUser.linkNickname==userInfo.linkNickname && currentUser.role == Role.DEFAULT_USER && <MenuItem onClick={handleOpenModalModeratorRequest}>Send a moderator request</MenuItem>}
                                                {currentUser && currentUser.linkNickname==userInfo.linkNickname && <MenuItem onClick={handleOpenModalDelete} sx={{color: 'error.main'}}>Delete
                                                    the account</MenuItem>}
                                                {currentUser && currentUser.linkNickname==userInfo.linkNickname && <MenuItem onClick={handleOpenModalLogout}
                                                          sx={{color: 'text.secondary'}}>Logout</MenuItem>}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                        <DeleteModal open={openModalDelete} onClose={handleCloseModalDelete} children={<></>}/>
                        <ModeratorRequestModal open={openModalModeratorRequest}
                                               onClose={handleCloseModalModeratorRequest} children={<></>}/>
                        <LogoutModal open={openModalLogout} onClose={handleCloseModalLogout} children={<></>}/>
                    </Toolbar>
                    <Table aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Full name</strong>
                                </TableCell>
                                <TableCell>{userInfo.firstName} {userInfo.lastName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Subscribers</strong>
                                </TableCell>
                                <TableCell>{userInfo._count.Followers}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Posts</strong>
                                </TableCell>
                                <TableCell>{userInfo.postNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Comments</strong>
                                </TableCell>
                                <TableCell>{userInfo.commentNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Birthdate</strong>
                                </TableCell>
                                <TableCell>{new Date(userInfo.birthday).getDate()}.{new Date(userInfo.birthday).getMonth() + 1}.{new Date(userInfo.birthday).getFullYear()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>User since</strong>
                                </TableCell>
                                <TableCell>{new Date(userInfo.createdAt).getDate()}.{new Date(userInfo.createdAt).getMonth() + 1}.{new Date(userInfo.createdAt).getFullYear()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Activated</strong>
                                </TableCell>
                                <TableCell>{userInfo.secondVerification ? 'User is activated' : 'User isn\'t activated (probably bot or has been created recently)'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{width: '100%', typography: 'body1', mt: 2}}>
                    <TabContext value={tabPosition}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                <Tab label="Subscribers statistics" value="1"/>
                                <Tab label="Comments" value="2"/>
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Box>
                                <Typography variant={"h5"} align={"center"}>Subscribers
                                    of <em>{userInfo.nickname}</em></Typography>
                                {chart}
                            </Box>
                        </TabPanel>
                        <TabPanel value="2"><UserCommentList /></TabPanel>
                    </TabContext>
                </Box>
            </Grid>
        </Grid>
    );
};

export default UserInfoPage;