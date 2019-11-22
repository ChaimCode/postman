/**
 * jwt_token自动生成
 * @param source 源数据
 * @returns {string} 加密的token
 */

function base64url(source) {
    // 编码源数据
    encodedSource = CryptoJS.enc.Base64.stringify(source);

    // 移除特殊符号相关, 以及使用-替换+, 使用_替换/
    encodedSource = encodedSource.replace(/=+$/, '');
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
}

function addIAT(data) {
    // 添加随机数
    data.iat = Math.floor(Date.now() / 1000) + 257;
    return data;
}


var header = {
    "typ": "JWT",
    "alg": "HS256"
};

// 从环境变量获取指定的用户ID
var account_id = pm.variables.get('account_id');

var data = {
    type: 'AccountToken',
    id: account_id,
    nickname: '猫先森',
    sex: '1',
    status: 'normal',
    subscribed: 1,
    role: 'lecturer',
};
data = addIAT(data);

// encode header
var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
var encodedHeader = base64url(stringifiedHeader);

// encode data
var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
var encodedData = base64url(stringifiedData);

// build token
var token = encodedHeader + "." + encodedData;

// sign token
var secret = pm.variables.get('jwt_secret');
var signature = CryptoJS.HmacSHA256(token, secret);
signature = base64url(signature);
var signedToken = token + "." + signature;

postman.setGlobalVariable('jwt_token', signedToken);
