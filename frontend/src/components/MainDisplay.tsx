import React, { useState } from "react";
import { useReactiveVar } from "@apollo/client";
import { AppBar, Box, Button, Drawer, Hidden, IconButton, makeStyles, Toolbar, Typography } from "@material-ui/core";
import { useFormikContext } from "formik";
import { useHistory } from "react-router-dom";
import { userStorageVar } from "../cache";
import { UpdateStateInput } from "./LoggedIn";
import PacklistForm from "./PacklistForm";
import PacklistSelector from "./PacklistSelector";
import UserItemsForm from "./UserItemsForm";
import { Menu as MenuIcon } from "@material-ui/icons";

const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  // appBar: {
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   marginLeft: drawerWidth,
  // },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  topbarItem: {
    margin: theme.spacing(1)
  },
  // drawer: {
  //   width: drawerWidth,
  //   flexShrink: 0,
  // },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const MainDisplay = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const user = useReactiveVar(userStorageVar);
  const [packlistId, setPacklistId] = useState<string>("");
  const history = useHistory();
  const classes = useStyles();
  const formikContext = useFormikContext<UpdateStateInput>();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const packlistIndex = formikContext.values.packlists.findIndex(p => p.id === packlistId);

  const logout = () => {
    localStorage.removeItem("packlister-user");
    userStorageVar(null);
  };

  return (
    <Box className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Box marginLeft="auto">
            {user?.token && <>
              <Button variant="outlined" color="inherit" onClick={formikContext.submitForm}>Save</Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
              <Button color="inherit" onClick={() => history.push("/change-password")}>Change password</Button>
            </>}
            {!user?.token && <>
              <Button color="inherit" onClick={() => history.push("/register")}>Register</Button>
              <Button color="inherit" onClick={() => history.push("/login")}>Login</Button>
            </>}
          </Box>
        </Toolbar>
      </AppBar>
      <div className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            className={classes.drawer}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{ paper: classes.drawerPaper }}
          >
            <div className={classes.toolbar}>
              <Box padding={1}><Typography variant="h4">Packlister</Typography></Box>
            </div>
            <Box maxHeight="35%">
              <PacklistSelector
                // packlistIndex={packlistIndex}
                packlistId={packlistId}
                setPacklistId={setPacklistId}
              />
            </Box>
            <Box maxHeight="55%">
              <UserItemsForm />
            </Box>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{ paper: classes.drawerPaper }}
          >
            <div className={classes.toolbar}>
              <Box padding={1}><Typography variant="h4">Packlister</Typography></Box>
            </div>
            <Box maxHeight="35%">
              <PacklistSelector
                // packlistIndex={packlistIndex}
                packlistId={packlistId}
                setPacklistId={setPacklistId}
              />
            </Box>
            <Box maxHeight="55%">
              <UserItemsForm />
            </Box>
          </Drawer>
        </Hidden>
      </div>
      <Box className={classes.content}>
        <div className={classes.toolbar} />
        <PacklistForm
          packlistIndex={packlistIndex}
        />
      </Box>
    </Box>
  );
};

export default MainDisplay;