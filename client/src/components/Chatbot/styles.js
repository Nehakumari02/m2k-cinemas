import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    backgroundColor: '#b72429',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#9a1d22',
    },
    zIndex: 1300,
  },
  chatWindow: {
    position: 'fixed',
    bottom: theme.spacing(12),
    right: theme.spacing(4),
    width: 350,
    height: 500,
    backgroundColor: '#1a1a24',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1300,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#b72429',
    color: '#fff',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  messageArea: {
    flex: 1,
    padding: theme.spacing(2),
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  messageRow: {
    display: 'flex',
    flexDirection: 'column',
  },
  botMessageRow: {
    alignItems: 'flex-start',
  },
  userMessageRow: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '85%',
    padding: theme.spacing(1.5, 2),
    borderRadius: 16,
    fontSize: '0.9rem',
    lineHeight: 1.4,
  },
  botBubble: {
    backgroundColor: '#2a2a36',
    color: '#fff',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#b72429',
    color: '#fff',
    borderBottomRightRadius: 4,
  },
  optionsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  optionChip: {
    backgroundColor: 'transparent',
    color: '#b72429',
    border: '1px solid #b72429',
    fontWeight: 600,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(183, 36, 41, 0.1)',
    },
  },
  inputArea: {
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: '#1a1a24',
  },
  input: {
    flex: 1,
    '& .MuiInputBase-root': {
      color: '#fff',
      backgroundColor: '#2a2a36',
      borderRadius: 24,
      padding: '4px 16px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
  sendButton: {
    color: '#b72429',
    backgroundColor: 'transparent',
  },
}));
