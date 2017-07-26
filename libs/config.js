const REG_INFO = {
    title: /(^\s*)#+.+/m,
    method: /(GET|POST|HOST)/,
    url: /https?:\/\/(\w+\.)+\w+\/?/ig,
    uri: /\s?(\/\w+)+\/?/ig,
    every: /[\r\n]+/ig,
    parameters: /\+.*[\s\S]?[^+\s?Parameters|Response][\s\S]/ig,
    item: /[^(.*)]+/ig,
    code: /({[\s\S]+})/,
    PLACEHOLDER: /PLACEHOLDER\s+ PLACEHOLDER/ig,
    cut: /\s?#\s?/ig,
    hostTitle: /host:\s?https?:\/\/(\w+\.)+\w+/ig,
    getorpost: /GET|POST/ig,
    name: /\+\s?/,
    type: /[^,\s]+/ig,
    string: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/ig, // keys-不要最后一个
    punctuation: /[{}[\];(),.:]/g, // 获取{}[];(),.:
    number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/ig,
    function: /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/ig,
    keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/i
}

const BASE_INFO = {
    RELEASE: '20170621', // 发布时期
    VERSION: '1.0.0' // 版本号
}

export {
    REG_INFO,
    BASE_INFO
}
