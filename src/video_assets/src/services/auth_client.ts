import { AuthClient } from '@dfinity/auth-client';

// returns true for existing authentication
export const checkForExistingAuthentication = async (): Promise<boolean> => {
  const authClient = await AuthClient.create();
  return await authClient.isAuthenticated();
};

// returns true if login / register via Internet Identity was successful
export const authWithInternetIdentity = async (): Promise<boolean> => {
  const authClient = await AuthClient.create();
  return new Promise(async (resolve, reject) => {
    await authClient.login({
      onError: async (error) => {
        reject('Internet Identity login unsuccessful: ' + error);
      },
      onSuccess: async () => {
        resolve(true);
      },
      identityProvider:
        process.env.REACT_APP_IDENTITY_PROVIDER ||
        'http://localhost:8000?canisterId=renrk-eyaaa-aaaaa-aaada-cai',
    });
  });
};
