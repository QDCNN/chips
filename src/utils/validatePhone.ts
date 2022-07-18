
// 验证手机号

// export const verifyPhoneNumber = (number,number1) => {
//   if (number) {
//     return true
//   } else {
//     return false
//   }
  
// }

// 验证手机号码
const validatePhone = {
    IdentityCode_isPhoneNo(phone) {//检查号码是否符合规范，包括长度，类型  
    var reg = /^1[3456789]{1}\d{9}$/; //手机号码为11位，第一位为数字1    
        if (reg.test(phone) === false) {
            return false;
        }
        return true;
    },
    IdentityPhoneValid(phone) {//   身份证号码检验主入口 
        let pass = true;
        //是否为空    
        if (pass && phone === '')
            pass = false;
        //校验长度，类型
        if (pass && validatePhone.IdentityCode_isPhoneNo(phone) === false)
            pass = false;
        return pass
    }
}
export default validatePhone.IdentityPhoneValid   //导出