module.exports = {
	mergeForCoverage: function (files) {
		var coverageFiles = {};// filename.js -> 'coverage'
		files.forEach(function (key) {
			coverageFiles[key] = 'coverage';
		});
		return coverageFiles;
	}
};
