import { REG_INFO } from './config'
import Method from './method'
/**
 * Rmarked 类，继承Method类
 */
class Rmarked extends Method {
    constructor (name) {
        super()
        this.name = name
        this.get = super.get
    }

    /**
     * getTitleStr 获取title-str
     * @param  [{String}]   previous     数据源
     * @param  [{String}]   strArr       数据源DOM字符串
     * return  [{String}]   返回result-str
     */
    getTitleStr (previous, strArr = []) {
        if (!strArr || !strArr.length) {
            return this
        }
        previous = strArr.reduce((prev, item) => {
            const hostStr = this.setHost(item)
            prev = prev.replace(item, hostStr)
            return prev
        }, previous)
        return previous
    }

    /**
     * getCodeJsonStr 获取json-str
     * @param  [{String}]   previous     数据源
     * @param  [{String}]   str       数据源str字符串
     * return  [{String}]   返回result-str
     */
    getCodeJsonStr (previous, str) {
        const apiCode = this.setApiHandler(str)
        previous = previous.replace(str, apiCode.data)
        return {
            previous,
            data: apiCode.json
        }
    }

    /**
     * setHost 设置host-dom
     * @param  [{Array}]   arr     数据源
     * return  [{Array}]   返回结果(Array)
     */
    getLastParametersArr (arr = []) {
        if (!arr || !arr.length) {
            return this
        }
        return arr.reduce(function (previous, current) {
            current = current.trim()
            const item = current.match(REG_INFO.item)
            const name = item[0] ? item[0].trim().replace(REG_INFO.name, '') : ''
            const description = item[3].trim() || ''
            const types = item[1] ? item[1] : ''
            const isType = types.match(REG_INFO.type)
            const type = types ? (isType ? isType[0] : '') : ''
            const required = isType && (isType[1] ? 'yes' : 'no')
            previous.push({
                name,
                description,
                type,
                required
            })
            return previous
        }, [])
    }

    /**
     * getParameters 处理+ xx 格式 - table
     * @param  [{String}]   data     数据源
     * return  [{Array}]   返回结果(Array)
     */
    getParameters (data) {
        return (() => {
            const parametersArr = super.getParametersArr(data)
            return this.getLastParametersArr(parametersArr)
        })()
    }

    /**
     * getExamples 处理marked table
     * @param  [{String}]   text     数据源
     * return  待定
     */
    getExamples (str) {
        return str
    }

    /**
     * getCodeJsonData 获取code-json-集合
     * @param  [{String}]   data     数据源
     * return  [{String}]   返回数据JSON集合
     */
    getCodeJsonData = (data) => {
        return {
            title: this.get(data, 'title'),
            method: this.get(data, 'method', false),
            uri: this.get(data, 'uri'),
            desc: this.getDesc(data),
            parameters: this.getParameters(data),
            examples: this.getExamples(data),
            code: this.get(data, 'code', false)
        }
    }

    /**
     * getApiEveryHandler 获取api-code-every数据集合
     * @param  [{String}]   data     数据源
     * return  [{String}]   返回数据JSON集合
     */
    getApiEveryHandler (data) {
        const { title, method, uri, desc, examples, code, parameters } = this.getCodeJsonData(data)
        const apiTitle = super.setApiTitle(title)
        const apiDesc = super.setApiDesc(desc)
        const apiCode = super.setApiCode(code)
        const apiParameters = super.setApiParameters(parameters)
        const apiParametersArr = super.getParametersArr(data)
        const apiParam = super.setApiTitleLevel('参数列表:')
        const apiResponse = super.setApiTitleLevel('返回值示例:')

        return {
            title,
            desc,
            code,
            method,
            uri,
            examples,
            parameters,
            apiTitle,
            apiDesc,
            apiCode,
            apiParameters,
            apiParametersArr,
            apiParam,
            apiResponse
        }
    }

    /**
     * setApiHandler 设置api-code-dom
     * @param  [{String}]   data     数据源
     * return  [{String}]   返回dom-str
     */
    setApiHandler (data) {
        const { title, desc: descArr, method, uri, code, parameters, apiTitle, examples, apiCode, apiParameters, apiParametersArr, apiParam, apiResponse } = this.getApiEveryHandler(data)
        const self = this
        data = descArr ? descArr.reduce((previous, current, index) => {
            const str = self.setApiDesc(current)
            previous = previous.replace(current, str)
            return previous
        }, data) : descArr
        data = (apiParametersArr ? apiParametersArr
            .reduce((previous, current) => {
                previous = previous.replace(current, 'PLACEHOLDER')
                return previous
            }, data) : apiParametersArr)
            .replace(title, '<div class="api-item">' + apiTitle)
            .replace('+ Parameters', apiParam)
            .replace('+ Response', apiResponse)
            .replace(REG_INFO.PLACEHOLDER, apiParameters)
            .replace(code, apiCode + '</div>')

        return {
            data,
            json: {
                title,
                method,
                uri,
                descArr,
                parameters,
                examples,
                code
            }
        }
    }

    /**
     * lexer 设置代码分块解析替换(str -> domstr)处理
     * @param  [{String}]   data     数据源
     * return  [{String}]   返回dom-str
     */
    lexer (data) {
        const self = this
        const lastData = {}
        lastData['result'] = []
        const spData = data.split(REG_INFO.cut)
        const str = spData.length ? spData.reduce((previous, current) => {
            /**
             * 1. 空数据
             * 2. 标题+host
             * 3. 代码块
            */
            if (!current) {
                return previous
            }

            /**
             * 处理标题
            */
            const titleArr = current.match(REG_INFO.hostTitle)
            const titleArrLen = titleArr ? titleArr.length : 0

            if (titleArrLen) {
                lastData['host'] = titleArr
                previous = self.getTitleStr(previous, titleArr)
            }

            /**
             * 处理代码块
            */
            const hasApiCode = current.match(REG_INFO.getorpost)

            if (hasApiCode) {
                const str = '# ' + current
                // console.log(str)
                const opts = self.getCodeJsonStr(previous, str)
                previous = opts.previous
                lastData['result'].push(opts.data)
            }

            return previous
        }, data) : spData

        return {
            str,
            data: lastData
        }
    }
}

const _Rmarked = new Rmarked()

export default _Rmarked

