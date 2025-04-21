const generateVerificationToken = () => {
    const token = Math.floor(100000 + Math.random() * 900000); // always 6-digit number
    return token.toString();
  };
  
  export default generateVerificationToken;
  