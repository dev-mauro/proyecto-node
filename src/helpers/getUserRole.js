import { listOfAdminEmails } from "./listOfAdminEmails.js";

const getUserRole = (users) => {
  const { email } = users;

  return (listOfAdminEmails.includes(email))
    ? 'admin'
    : 'user' 
};

export { getUserRole };