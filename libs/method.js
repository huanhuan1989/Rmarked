import { REG_INFO } from './config'
import Base from './base'
import utils from '../utils'

/**
 * Method 类集合，继承Base类
 */
class Method extends Base {
    constructor () {
        super()
        this.NAME = 'Method'
        this.get = super.get
    }

    /**
     * setHost 设置host-dom
     * @param  [{String}]   text     数据源
     * return  [{String}]   返回dom-str
     */
    setHost (text) {
        const method = this.get(text, 'method', false)
        const url = this.get(text, 'url')
        return `<p class="meta">
            <span class="meta-name">[${method}]</span>
            <span class="meta-value">${url}</span>
        </p>`
    }

    /**
     * setApiTitle 设置api-title-dom
     * @param  [{String}]   text     数据源
     * return  [{String}]   返回dom-str
     */
    setApiTitle (text) {
        const method = this.get(text, 'method', false)
        const uri = this.get(text, 'uri')
        return `<h2 class="action">
            <span class="method ${method}">${method}</span>
            <span class="uri">${uri}</span>
        </h2>`
    }

    getCodeKeyStr (str, reg) {
        const _reg = new RegExp(reg)
        return str.match(_reg)
    }

    getCodeEveryDom (str, name) {
        return `<span class="code-${name}">${str}</span>`
    }

    getCodeKeysValueHandler (data = [], name, prev) {
        if (!data || !data.length) {
            return data
        }
        data = data.reduce((previous, current) => {
            current = current.trim()
            const str = this.getCodeEveryDom(current, name)
            previous.push({
                [current]: str
            })
            return previous
        }, [])
        data = utils.uniqWith(data, utils.isEqual)
        data = prev ? data.concat(prev) : data
        return data
    }

    getApiCodeEveryHandler (code) {
        const keywordStr = this.getCodeKeyStr(code, REG_INFO.keyword)
        const stringStr = this.getCodeKeyStr(code, REG_INFO.string)
        const numberStr = this.getCodeKeyStr(code, REG_INFO.number)
        const punctuationStr = this.getCodeKeyStr(code, REG_INFO.punctuation)

        const getKeywordArr = this.getCodeKeysValueHandler(keywordStr, 'keyword')
        const getStrArr = this.getCodeKeysValueHandler(stringStr, 'string', getKeywordArr)
        const getNumberArr = this.getCodeKeysValueHandler(numberStr, 'number', getStrArr)
        const getPunctuationArr = this.getCodeKeysValueHandler(punctuationStr, 'punctuation', getNumberArr)

        return {
            getPunctuationArr
        }
    }

    getApiJsonCodeStr (code, arr = []) {
        if (!arr || !arr.length) {
            return code
        }
        code = arr.reduce((previous, current) => {
            const key = Object.keys(current)
            const val = current[key]
            const reg = new RegExp((key.indexOf('[') !== -1 ? `[${key}]` : key), 'ig')
            previous = previous.replace(reg, val)
            return previous
        }, code)
        return code
    }
    /**
     * setApiCode 设置api-code-dom
     * @param  [{String}]   code     数据源
     * return  [{String}]   返回dom-str
     */
    setApiCode (code) {
        const {getPunctuationArr: apiArr} = this.getApiCodeEveryHandler(code)
        const data = this.getApiJsonCodeStr(code, apiArr)

        return `<pre>
            <code>    ${data}
            </code>
        </pre>`
    }

    /**
     * setApiDesc 设置api-desc-dom
     * @param  [{String}]   text     数据源
     * return  [{String}]   返回dom-str
     */
    setApiDesc (text) {
        return `<p>${text}</p>`
    }

    /**
     * setApiTitleLevel 设置api-title-level-dom
     * @param  [{String}]   text     数据源
     * @param  [{Number}]   level    H标签等级
     * return  [{String}]   返回dom-str
     */
    setApiTitleLevel (text, level = 4) {
        return `<h${level}>${text}</h${level}>`
    }

    /**
     * setApiParameters 设置api-table-dom
     * @param  [{Array}]   data     数据源
     * return  [{String}]  返回dom-str
     */
    setApiParameters (data = []) {
        if (!data || !data.length) {
            return data
        }
        const str = data.reduce((previous, current) => {
            const tr = `<tr>
                <td>${current.name}</td>
                <td>${current.type}</td>
                <td>${current.required}</td>
                <td>${current.description}</td>
            </tr>`
            return previous + tr
        }, '')

        return `<table class="params">
            <thead>
                <tr>
                    <th>名称</th>
                    <th>类型</th>
                    <th>必填</th>
                    <th>说明</th>
                </tr>
            </thead>
            <tbody>
                ${str}
            </tbody>
        </table>`
    }

    /**
     * getDesc 获取介绍-str
     * @param  [{Array}]   data     数据源
     * return  [{String}]  返回字符串
     */
    getDesc (data) {
        const strArr = data.split('+ Parameters')[0].trim().match(/[^#\s?].*/ig)
        return strArr.filter((data) => {
            return strArr[0] !== data
        })
    }

    /**
     * setApiParameters 设置api-table-dom
     * @param  [{String}]   data     数据源
     * return  [{String}]   返回结果集(Array)
     */
    getParametersArr (data) {
        return data.match(REG_INFO.parameters)
    }

}

export default Method
