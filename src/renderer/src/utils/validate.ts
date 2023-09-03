const Validate = {
  /** 手机号校验 */
  mobile: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
  /** 验证码 */
  code: /^\d{6}$/,
  /** 密码正则 仅支持英文数字至少包含两种字符类型 */
  password:
    /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*()_"'+,-./:;<=>?[_\]{|}~\\]+$)[a-zA-Z\d!@#$%^&*()_"'+,-./:;<=>?[_\]`{|}~\\]+$/,
  required: (message: string) => {
    return {
      required: true,
      message
    }
  },
  match: (regExp: RegExp, message: string) => {
    return {
      match: regExp,
      message
    }
  }
}

export default Validate
