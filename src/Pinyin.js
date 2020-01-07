const pinyin = require("pinyin");


class Pinyin {
	//获取分词拼音
	getPY(text) {
		return pinyin(text);
	}

	//获取多音字
	getDPY(text) {
		return pinyin(text, {
			heteronym: true
		})
	}

	//多音字、分词
	// getDFPY(text) {
	// 	return pinyin(text, {
	// 		heteronym: true,
	// 		segment: true
	// 	})
	// }

	//设置拼音风格
	getFGPY(text) {
		return pinyin(text, {
			style: pinyin.STYLE_INITIALS,
			heteronym: true
		})
	}

	//排序
	compare(text) {
		let data = text.split('');
		return data.sort(pinyin.compare);
	}
}

module.exports = Pinyin;