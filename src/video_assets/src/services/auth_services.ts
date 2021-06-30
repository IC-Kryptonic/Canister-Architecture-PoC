import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

let _authClient: null | AuthClient = null;

const getAuthClient = async (): Promise<AuthClient> => {
  if (!_authClient) {
    _authClient = await AuthClient.create();
  }
  return _authClient;
};

// returns true for existing authentication
export const checkForExistingAuthentication = async (): Promise<boolean> => {
  const authClient = await getAuthClient();
  return await authClient.isAuthenticated();
};

// returns true if login / register via Internet Identity was successful
export const authWithInternetIdentity = async (): Promise<boolean> => {
  const authClient = await getAuthClient();
  return new Promise(async (resolve, reject) => {
    await authClient.login({
      onError: async (error) => {
        reject('Internet Identity login unsuccessful: ' + error);
      },
      onSuccess: async () => {
        resolve(true);
      },
      identityProvider:
        process.env.IDENTITY_PROVIDER ||
        'http://localhost:8000?canisterId=renrk-eyaaa-aaaaa-aaada-cai',
    });
  });
};

// returns identity of authenticated user
export const getAuthenticatedIdentity = async (): Promise<Identity> => {
  const authClient = await getAuthClient();
  return authClient.getIdentity();
};
