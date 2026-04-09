export function getFacebookAuthUrl() {
  const { VITE_FACEBOOK_CLIENT_ID, VITE_FACEBOOK_REDIRECT_URIS } = import.meta
    .env;

  const url = `https://www.facebook.com/v21.0/dialog/oauth`;
  const query = {
    client_id: VITE_FACEBOOK_CLIENT_ID,
    redirect_uri: VITE_FACEBOOK_REDIRECT_URIS,
    response_type: "code",
    scope: "public_profile,email",
  };

  const queryString = new URLSearchParams(query).toString();
  return `${url}?${queryString}`;
}
