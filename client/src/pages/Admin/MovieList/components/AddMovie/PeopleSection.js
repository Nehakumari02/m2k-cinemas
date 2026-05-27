import React from 'react';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Chip,
  withStyles,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  fieldStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.75),
    minHeight: 36,
    marginBottom: theme.spacing(1.5),
  },
  empty: {
    color: '#94a3b8',
    fontSize: '0.8rem',
    fontStyle: 'italic',
  },
  uploadRow: {
    paddingTop: 0,
  },
  addButton: {
    alignSelf: 'flex-start',
    textTransform: 'none',
    fontWeight: 700,
  },
  uploadBtn: {
    textTransform: 'none',
    fontWeight: 600,
  },
  fileInput: {
    display: 'none',
  },
  fileMeta: {
    marginTop: theme.spacing(0.75),
    color: '#64748b',
    fontSize: '0.75rem',
  },
  fileNames: {
    marginTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(1.5),
    color: '#475569',
    fontSize: '0.72rem',
    maxHeight: 72,
    overflowY: 'auto',
  },
});

const CREW_ROLES = ['Director', 'Producer', 'Writer', 'Music', 'Cinematographer', 'Editor'];

function PeopleSection({
  classes,
  withRole,
  nameLabel,
  nameValue,
  roleValue,
  onNameChange,
  onRoleChange,
  onAdd,
  members,
  onRemove,
  files,
  onFilesChange,
  uploadLabel,
  addLabel = 'Add',
}) {
  const inputId = `people-upload-${withRole ? 'crew' : 'cast'}`;

  return (
    <div className={classes.root}>
      <div className={classes.fieldStack}>
        {withRole ? (
          <>
            <TextField
              label={nameLabel}
              variant="outlined"
              size="small"
              fullWidth
              value={nameValue}
              onChange={e => onNameChange(e.target.value)}
            />
            <TextField
              select
              label="Role"
              variant="outlined"
              size="small"
              fullWidth
              value={roleValue}
              onChange={e => onRoleChange(e.target.value)}>
              {CREW_ROLES.map(role => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </>
        ) : (
          <TextField
            label={nameLabel}
            variant="outlined"
            size="small"
            fullWidth
            value={nameValue}
            onChange={e => onNameChange(e.target.value)}
          />
        )}

        <div className={classes.uploadRow}>
          <input
            id={inputId}
            className={classes.fileInput}
            type="file"
            accept="image/*"
            multiple
            onChange={e => {
              onFilesChange(Array.from(e.target.files || []));
              e.target.value = '';
            }}
          />
          <label htmlFor={inputId}>
            <Button
              className={classes.uploadBtn}
              variant="outlined"
              size="small"
              component="span"
              startIcon={<CloudUploadIcon />}>
              {uploadLabel}
            </Button>
          </label>
          <Typography className={classes.fileMeta}>
            {files.length
              ? `${files.length} image${files.length > 1 ? 's' : ''} selected (same order as list below)`
              : 'Optional — match photo order to names below'}
          </Typography>
          {!!files.length && (
            <div className={classes.fileNames}>
              {files.map((file, idx) => (
                <div key={`${file.name}-${idx}`}>
                  {idx + 1}. {file.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          className={classes.addButton}
          color="primary"
          variant="contained"
          size="small"
          onClick={onAdd}>
          {addLabel}
        </Button>
      </div>

      <div className={classes.chips}>
        {members.length ? (
          members.map((member, index) => (
            <Chip
              key={`${member.name}-${member.role || 'cast'}-${index}`}
              size="small"
              label={withRole ? `${member.role}: ${member.name}` : member.name}
              onDelete={() => onRemove(index)}
            />
          ))
        ) : (
          <Typography className={classes.empty}>No names added yet</Typography>
        )}
      </div>
    </div>
  );
}

export default withStyles(styles)(PeopleSection);
