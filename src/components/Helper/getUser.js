export const getUser = () => {
  const data = localStorage.getItem("user");
  const user = JSON.parse(data);

  return user;
};
