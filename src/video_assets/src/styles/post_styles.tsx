import { makeStyles } from '@material-ui/core';

const postStyles = makeStyles({
  postContainer: {
    maxWidth: 500,
    borderBottom: 'solid 1px rgb(227, 227, 228)',
    paddingBottom: 15,
    marginBottom: 50,
  },
  followButton: {
    border: '1px solid #fe2c55',
    borderRadius: 3,
    width: 88,
    height: 16,
    color: '#fe2c55',
    fontWeight: 600,
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
  },
  followingButton: {
    border: '1px solid rgb(227, 227, 228)',
    borderRadius: 3,
    width: 88,
    height: 16,
    color: 'rgb(163, 162, 162)',
    fontWeight: 600,
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
  },
  video: {
    borderRadius: 15,
    width: '80%',
    marginTop: 10,
    marginBottom: 20,
  },
  loadingSpinner: {
    margin: 40,
    color: 'black',
  },
  userProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 3,
  },
  lightText: {
    color: 'rgb(163, 162, 162)',
  },
  bottomButton: {
    width: 50,
    height: 50
  }
});

export { postStyles };
