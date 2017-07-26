# Rmarked

依赖于markdown，在markdown基础上增加解析api功能


```javascript
const codeSingleTemp = `
    # GET /path/to/api
                                    
    描述该API的功能

    + Parameters
        + pn (Integer) ... 页码
        + ps (Integer, optional) ... 页面大小

    + Response

        {
            "errno" : 0,
            "errmsg" : null,
            "total" : 1,
            "list" : [ {
                "vid" : 237,
                "name" : "天文台"
            } ]
        }
    `
```

使用方法

```javascript
//方法引用
import Rmarked from '@/libs/rmarked/index'

//方法使用
Rmarked.lexer(code)
```