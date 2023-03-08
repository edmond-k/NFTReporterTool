import * as React from 'react';
import { useState } from "react";
import { AppBar, IconButton, Toolbar, Typography, Button, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText} from "@mui/material"
import { Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles"
import AirlineSeatFlatIcon from '@mui/icons-material/AirlineSeatFlat';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import MenuIcon from '@mui/icons-material/Menu';
import { useEthers } from "@usedapp/core"



const pages = ["Add", "Remove"];

const DrawerHeader = styled('div')((({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  backgroundColor: "inherit"
})))

const drawerWidth = 241;

export const MuiNavBar = () => {
  const theme = useTheme()
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const { account, activateBrowserWallet, deactivate } = useEthers()

  const isConnected = account !== undefined


  return (
    <div>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleDrawerOpen}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: "Audiowide" }}>
            CONTRA NFT REPORTER
          </Typography>
          <div>
            {isConnected ? (
              <Button color="primary" variant="contained"
                onClick={deactivate}>
                Disconnect
              </Button>
            ) : (
              <Button color="primary" variant="contained"
                onClick={() => activateBrowserWallet()}>
                Connect
              </Button>
            )
            }
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          },
          
        }}
        variant="temporary"
        anchor="left"
        onClose={() => {
          handleDrawerClose()
        }}
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <AgricultureIcon /> : <AirlineSeatFlatIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {pages.map((link, index) => {
            return (
              <ListItem button
                component={Link}
                to={`/${link}`}
                key={index}>
                <ListItemIcon >
                  {index % 2 === 0 ? <AgricultureIcon /> : <AirlineSeatFlatIcon />}
                </ListItemIcon>
                <ListItemText primary={link} />
              </ListItem>
            )
          })}
        </List>
      </Drawer>
    </div>
  )
}