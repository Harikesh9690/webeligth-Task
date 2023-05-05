const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
  }
  
  const validString = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
  }
  
  const isvalidEmail = /^\s*[a-zA-Z0-9]+([\.\-\_\+][a-zA-Z0-9]+)*@[a-zA-Z]+([\.\-\_][a-zA-Z]+)*(\.[a-zA-Z]{2,3})+\s*$/
  
  const isvalidMobile = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/
  
  const isValidPassword = function (pw) {
     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/.test(pw);
  };
  
  const pincodeValid = /^(\d{4}|\d{6})$/
  
  
  const keyValid = function (value) {
    if (Object.keys(value).length > 0) return true;
    return false;
  };
  
  
  const priceValid = function (value) {
    const number = /^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/
    return number.test(value)
  }
  
  module.exports = { isValid, priceValid, isvalidEmail, isvalidMobile, isValidPassword, pincodeValid, keyValid, validString }