import { Avatar, Checkbox, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { IconFileDownload } from "@tabler/icons-react";
import { IconDownload, IconFile } from "@tabler/icons-react";
import React, { Fragment } from "react";
import { formatBytes } from "utils/helper";

const ListFile = ({ checked, setChecked, listFile }) => {

    const onClickCheckedAll = () => {
        if (checked?.length === listFile.length) {
            setChecked([]);
        } else {
            setChecked(listFile?.map((item) => (item?.fileId)))
        }
    };
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    return (
        <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {listFile?.length > 0 && (<>
                    <Divider />
                    <ListItem
                        key={0}
                        disablePadding
                    >
                        <ListItemButton sx={{ padding: '5px' }} role={undefined} onClick={() => { onClickCheckedAll() }} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked?.length === listFile?.length}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': 0 }}
                                />
                            </ListItemIcon>
                            <ListItemText id={0} sx={{ marginLeft: '10px' }} primary={'List File Upload'} />
                            <ListItemText id={0} sx={{ textAlign: 'right' }} primary={'Download'} />
                        </ListItemButton>
                    </ListItem>
                </>
                )}
                {listFile?.length > 0 && listFile?.map((value) => {
                    const labelId = `checkbox-list-label-${value?.fileId}`;

                    return (
                        <Fragment key={value?.fileId}>
                            <Divider />
                            <ListItem

                                key={value?.fileId}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="comments">
                                        <IconFileDownload />
                                    </IconButton>
                                }
                                disablePadding
                            >
                                <ListItemButton sx={{ padding: '5px' }} role={undefined} onClick={handleToggle(value?.fileId)} dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked.includes(value?.fileId)}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <IconFile />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText id={labelId} secondary={formatBytes(value?.fileSize)} primary={`${value?.fileName}${value?.fileExtenstion ? '.' + value?.fileExtenstion : ''}`} />
                                </ListItemButton>
                            </ListItem>
                        </Fragment>
                    );
                })}
            </List>
        </>
    )
}
export default ListFile;