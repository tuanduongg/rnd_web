import React, { useEffect, useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { hasChildren, menu } from './custom_menu.service';
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { IconLink } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfigRouter } from 'routes/ConfigRouter';
import { MENU_OPEN } from 'store/actions';

export default function CustomMenu() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // active menu item on page load
  useEffect(() => {
    const find = Object.values(ConfigRouter).find((item) => item === pathname);
    if (find) {
      dispatch({ type: MENU_OPEN, id: find });
    }
    // eslint-disable-next-line
  }, [pathname]);
  const itemHandler = (id) => {
    dispatch({ type: MENU_OPEN, id });
    navigate(id);
    // if (matchesSM) {
    //   dispatch({ type: SET_MENU, opened: false });
    // }
  };
  return menu.map((item, key) => <MenuItem key={key} item={item} onClick={() => itemHandler(item.id)} />);
}

const MenuItem = ({ item, onClick }) => {
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return <Component onClick={onClick} item={item} />;
};

const SingleLevel = ({ item, onClick }) => {
  const customization = useSelector((state) => state.customization);
  const Icon = item?.icon;
  const itemIcon = item?.icon ? <Icon stroke={1.5} size="1.3rem" /> : <IconLink />;
  const selected = customization.isOpen.findIndex((id) => id === item?.id) > -1;
  return (
    <ListItemButton onClick={onClick} sx={{ borderRadius: `${customization.borderRadius}px` }} selected={selected}>
      <ListItemIcon>{itemIcon}</ListItemIcon>
      <ListItemText sx={{ '.MuiListItemText-primary': { color: selected ? '#005595' : '',fontWeight: selected  ? '600' : '' } }} primary={item.title} />
    </ListItemButton>
  );
};

const MultiLevel = ({ item, onClick }) => {
  const customization = useSelector((state) => state.customization);

  const { items: children } = item;
  const [open, setOpen] = useState(false);

  const Icon = item?.icon;
  const itemIcon = item?.icon ? <Icon stroke={1.5} size="1.5rem" /> : <IconLink />;

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <React.Fragment>
      <ListItemButton
        sx={{ borderRadius: `${customization.borderRadius}px` }}
        selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
        onClick={handleClick}
      >
        <ListItemIcon>{itemIcon}</ListItemIcon>
        <ListItemText primary={item.title} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children.map((child, key) => (
            <MenuItem key={key} item={child} />
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
};
