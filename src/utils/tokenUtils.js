import jwt_decode from "jwt-decode";

export const getTokenFromLocalStorage = () => {
  // Lấy token từ localStorage
  const token = localStorage.getItem("token");
  return token;
};

export const setTokenToLocalStorage = (token) => {
  // Lưu token vào localStorage
  localStorage.setItem("token", token);
};

export const getIdUser = () => {
  // Lưu token vào localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    return { emailUser: "", IdUser: "" };
  }

  const decodedToken = jwt_decode(token);
  const emailUser = decodedToken.email;
  const IdUser = decodedToken.id;

  return { emailUser, IdUser };
};

export const removeTokenFromLocalStorage = () => {
  localStorage.removeItem("token"); // Xóa token từ localStorage
};
