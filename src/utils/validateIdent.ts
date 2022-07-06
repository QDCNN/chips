
// 验证手机号

// export const verifyPhoneNumber = (number,number1) => {
//   if (number) {
//     return true
//   } else {
//     return false
//   }
  
// }

// 验证身份证号
const validateIdent = {
    IdentityCode_isCardNo(card) {//检查号码是否符合规范，包括长度，类型  
        var reg = /^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$/; //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
        if (reg.test(card) === false) {
            return false;
        }
        return true;
    },
    IdentityCodeValid(card) {//   身份证号码检验主入口 
        let pass = true;
        let sex = ''
        //是否为空    
        if (pass && card === '')
            pass = false;
        //校验长度，类型
        if (pass && validateIdent.IdentityCode_isCardNo(card) === false)
            pass = false;
        return pass
    }
}
export default validateIdent.IdentityCodeValid   //导出