const fs = require('fs')
const DATA_FILENAME = 'data.json'

exports.readDatas = function (success, failure) {
    fs.readFile(DATA_FILENAME, 'utf8' , (error, text) => {
        if (error) {
            console.log(error)
            failure(error)
            return
        }

        success(text)
    })
}

 exports.writeDatas = function (content, success, failure) {
    fs.writeFile(DATA_FILENAME, JSON.stringify(content), error => {
        if (error) {
            console.error(error)
            failure(error)
            return
        }

        success()
    })
}
