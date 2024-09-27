import React, { useEffect, useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { hasChildren, menu, findParentIds } from './custom_menu.service';
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { IconLink } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfigRouter } from 'routes/ConfigRouter';
import { MENU_OPEN, MENU_OPEN_ARR } from 'store/actions';
import LinkIcon from '@mui/icons-material/Link';

export default function CustomMenu() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // active menu item on page load
  useEffect(() => {
    const find = Object.values(ConfigRouter).find((item) => item === pathname);
    if (find) {
      dispatch({ type: MENU_OPEN, id: find });
      const finds = findParentIds(menu, find);
      if (finds?.length > 0) {
        dispatch({ type: MENU_OPEN_ARR, id: [...finds, find] });
      }
    }
    // eslint-disable-next-line
  }, [pathname]);
  return menu.map((item, key) => <MenuItem key={key} item={item} />);
}

const MenuItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemHandler = (id) => {
    dispatch({ type: MENU_OPEN, id });
    navigate(id);
  };
  const checkChild = hasChildren(item);
  const Component = checkChild ? MultiLevel : SingleLevel;
  return <Component onClick={() => { itemHandler(item?.id) }} item={item} />;
};

const SingleLevel = ({ item, onClick }) => {
  const customization = useSelector((state) => state.customization);
  const Icon = item?.icon;
  const itemIcon = item?.icon ? <Icon stroke={1.5} size="1.3rem" /> : <LinkIcon />;
  const selected = customization.isOpen.findIndex((id) => id === item?.id) > -1;
  return (
    <ListItemButton onClick={onClick} sx={{ borderRadius: `${customization.borderRadius}px` }} selected={selected}>
      <ListItemIcon>{itemIcon}</ListItemIcon>
      <ListItemText sx={{ '.MuiListItemText-primary': { color: selected ? '#005595' : '', fontWeight: selected ? '600' : '' } }} primary={item.title} />
    </ListItemButton>
  );
};

const MultiLevel = ({ item, onClick }) => {
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();
  const { items: children } = item;
  const Icon = item?.icon;
  const itemIcon = item?.icon ? <Icon stroke={1.3} size="1.3rem" /> : <IconLink />;

  const handleClick = () => {
    if (customization?.isOpen?.includes(item?.id)) {
      const newArr = customization?.isOpen?.filter((id) => id !== item?.id)
      dispatch({ type: MENU_OPEN_ARR, id: newArr });
    } else {
      dispatch({ type: MENU_OPEN_ARR, id: [...customization?.isOpen, item?.id] });
    }
  };

  return (
    <React.Fragment>
      <ListItemButton
        sx={{ borderRadius: `${customization.borderRadius}px` }}
        // selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
        onClick={handleClick}
      >
        <ListItemIcon>{itemIcon}</ListItemIcon>
        <ListItemText primary={item.title} />
        {customization?.isOpen?.includes(item?.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={customization?.isOpen?.includes(item?.id)} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children.map((child, key) => (
            <MenuItem key={key} onClick={onClick} item={child} />
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
};
