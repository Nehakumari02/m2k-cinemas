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
  inputRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: theme.spacing(1),
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1.5),
  },
  inputRowWithRole: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr auto',
    gap: theme.spacing(1),
    alignItems: 'flex-start',
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
    marginTop: 'auto',
    paddingTop: theme.spacing(1.5),
    borderTop: '1px solid #e8ecf1',
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
      <div className={withRole ? classes.inputRowWithRole : classes.inputRow}>
        {withRole && (
          <TextField
            select
            label="Role"
            variant="outlined"
            size="small"
            value={roleValue}
            onChange={e => onRoleChange(e.target.value)}>
            {CREW_ROLES.map(role => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          label={nameLabel}
          variant="outlined"
          size="small"
          fullWidth
          value={nameValue}
          onChange={e => onNameChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        <Button color="primary" variant="contained" size="small" onClick={onAdd}>
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
            ? `${files.length} image${files.length > 1 ? 's' : ''} selected (same order as list above)`
            : 'Optional — match photo order to names above'}
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
    </div>
  );
}

export default withStyles(styles)(PeopleSection);
