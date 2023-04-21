import React, {useState} from 'react';
import {mockSubscribers} from "../mockData/mockSubscribers";
import {
    Avatar,
    Box, ClickAwayListener,
    Grid, Grow, IconButton, Link, MenuItem, MenuList,
    Paper, Popper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography
} from "@mui/material"
import ModeratorRequestModal from "../components/ModeratorRequestModal";
import DeleteModal from "../components/DeleteModal";
import LogoutModal from "../components/LogoutModal";
import {Line} from "react-chartjs-2"
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2'
ChartJS.register(...registerables)

interface User {
    id: string
    firstName: string
    lastName: string
    nickname: string
    linkNickname: string
    photo: string
    dateOfBirth: Date
    country: string
    createdAt: Date
    isActivated: boolean
    subscribers: number
}

export type SubscriberStatistics = {
    time: number
    subscribers: number
}

const mockUser = {
    id: '123',
    firstName: 'Dave',
    lastName: 'Smith',
    nickname: 'Davepro999, who loves Fortnite',
    linkNickname: 'davepro999official',
    image: 'https://sun9-34.userapi.com/impf/c622320/v622320607/4e1d6/1a-awkhClos.jpg?size=225x225&quality=96&sign=c175c8c775a36c0b9721b5bd319b0155&type=album',
    dateOfBirth: new Date('1998-09-03').getTime(),
    country: "United Kingdom",
    createdAt: new Date('2020-11-01').getTime(),
    isActivated: false,
    subscribers: 90139,
    posts: 20,
    comments: 193,
}

const UserInfoPage = () => {
    console.log(mockSubscribers)

    const [openAddMenu, setOpenAddMenu] = React.useState<boolean>(false)
    const [openModalModeratorRequest, setOpenModalModeratorRequest] = React.useState<boolean>(false)
    const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false)
    const [openModalLogout, setOpenModalLogout] = React.useState<boolean>(false)
    const [chartSubscriberData, setChartSubscriberData] = useState({
        labels: mockSubscribers.map((data) => (`${new Date(data.time).getDate()}.${new Date(data.time).getMonth()+1}.${new Date(data.time).getFullYear()}`)),
        datasets: [{
            label: "Number of subscribers",
            data: mockSubscribers.map((data) => data.subscribers),

        }],
        options: {
            plugins: {
                legend: {
                    display: false
                },
            }
        }
    })


    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleAddMenuToggle = () => {
        setOpenAddMenu((prevOpen) => !prevOpen);
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

    return (
        <Grid container justifyContent="center" sx={{mt: '20px', mb: '10px'}}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                <TableContainer component={Paper}>
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 },
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar>
                                        <Box component={"img"} src={mockUser.image} sx={{ objectFit: 'cover' }} minWidth={'100%'} minHeight={'100%'}/>
                                    </Avatar>
                                    <Typography sx={{ px: 2 }}>{mockUser.nickname} (<i><Link target={"_blank"} underline="none" href={"https://leetcode.com/"}>{mockUser.linkNickname}</Link></i>)</Typography>
                                </Box>
                                <IconButton aria-label="settings"
                                            ref={anchorRef}
                                            id="composition-button"
                                            aria-controls={openAddMenu ? 'composition-menu' : undefined}
                                            aria-expanded={openAddMenu ? 'true' : undefined}
                                            aria-haspopup="true"
                                            onClick={handleAddMenuToggle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                                </IconButton>
                        <Popper
                            open={openAddMenu}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            placement="bottom-start"
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
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
                                                <MenuItem onClick={handleAddMenuClose}>Edit the profile</MenuItem>
                                                <MenuItem onClick={handleOpenModalModeratorRequest}>Send a moderator request</MenuItem>
                                                <MenuItem onClick={handleOpenModalDelete} sx={{ color: 'error.main' }}>Delete the account</MenuItem>
                                                <MenuItem onClick={handleOpenModalLogout} sx={{ color: 'text.secondary' }}>Logout</MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                        <DeleteModal open={openModalDelete} onClose={handleCloseModalDelete} children={<></>}/>
                        <ModeratorRequestModal open={openModalModeratorRequest} onClose={handleCloseModalModeratorRequest} children={<></>}/>
                        <LogoutModal open={openModalLogout} onClose={handleCloseModalLogout} children={<></>}/>
                    </Toolbar>
                    <Table aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Full name</strong>
                                </TableCell>
                                <TableCell>{mockUser.firstName} {mockUser.lastName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Subscribers</strong>
                                </TableCell>
                                <TableCell>{mockUser.subscribers}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Posts</strong>
                                </TableCell>
                                <TableCell>{mockUser.posts}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Comments</strong>
                                </TableCell>
                                <TableCell>{mockUser.comments}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Birthdate</strong>
                                </TableCell>
                                <TableCell>{new Date(mockUser.dateOfBirth).getDate()}.{new Date(mockUser.dateOfBirth).getMonth()+1}.{new Date(mockUser.dateOfBirth).getFullYear()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Country</strong>
                                </TableCell>
                                <TableCell>{mockUser.country}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>User since</strong>
                                </TableCell>
                                <TableCell>{new Date(mockUser.createdAt).getDate()}.{new Date(mockUser.createdAt).getMonth()+1}.{new Date(mockUser.createdAt).getFullYear()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Activated</strong>
                                </TableCell>
                                <TableCell>{mockUser.isActivated ? 'User is activated' : 'User isn\'t activated (probably bot or has been created recently)' }</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ mt: 2 }}>
                    <Typography variant={"h5"} align={"center"}>Subscribers of <em>{mockUser.nickname}</em></Typography>
                    <Line data={chartSubscriberData} options={chartSubscriberData.options}/>
                </Box>
            </Grid>
        </Grid>
    );
};

export default UserInfoPage;