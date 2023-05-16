import cryptoJS from "crypto-js";

const useEncryption = () => {
  const cryptoKey = process.env.REACT_APP_CRYPTOGRAPHY_SECRET_KEY;

  const encryptData = (data) => {
    try {
      let dataToBeEncrypted;
      if (typeof data === "string") dataToBeEncrypted = data;
      else if (typeof data === "number") dataToBeEncrypted = data.toString();
      return cryptoJS.AES.encrypt(dataToBeEncrypted, cryptoKey).toString();
    } catch (err) {
      console.log(err);
    }
  };

  const decryptData = (encryptedData) => {
    try {
      const plain = cryptoJS.AES.decrypt(encryptedData.toString(), cryptoKey);
      return JSON.parse(plain.toString(cryptoJS.enc.Utf8));
    } catch (err) {}
  };
  return {
    encryptData,
    decryptData,
  };
};

export default useEncryption;
