import { REG_INFO, BASE_INFO } from './config'
/**
 * Base rmarked核心类
 */
class Base {

    constructor () {
        this.NAME = 'Base'
        this.VERSION = BASE_INFO.VERSION
        this.RELEASE = BASE_INFO.RELEASE
    }

    /**
     * getRelease 获取类名
     */
    getName () {
        return this.NAME
    }

    /**
     * getVersion 获取版本号
     */
    getVersion () {
        return this.VERSION
    }

    /**
     * getRelease 获取发布时期
     */
    getRelease () {
        return this.RELEASE
    }

    /**
     * set 预留方法
     */
    set () {
        return this
    }

    /**
     * get 通过正则返回str
     * @param  [{String}]   data     数据源
     * @param  [{String}]   type     正则类型
     * @param  [{Boolean}]  has      返回结果是否为空
     * return  [{String}]   result   返回符合正则结果
     */
    get (data, type, has = true) {
        const str = data.match(REG_INFO[type])
        const hasData = has ? data : ''
        const result = str ? str[0].trim() : hasData

        return result
    }

}

export default Base
