'use strict';
var files = require('./adminWebFiles').files;
var util = require('./grunt/utils.js');
var liveReloadPort = 35721;
var serverPort = 3501;

var lrSnippet = require('connect-livereload')({port: liveReloadPort});
var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// configurable paths
	var yeomanConfig = {
		app: 'app/Admin',
		dist: 'dist',
		src: 'app',
		cloudfrontUrl: 'https://testCDN.cloudfront.net',
		s3DistFolder: new Date().toISOString().replace(/:/g, '.')
	};

	var coverageFiles = files['src'];

	grunt.initConfig({
		yeoman: yeomanConfig,
		exec: {
			git_update: {
				cmd: 'git stash && git pull --rebase && git stash pop'
			}
		},
		watch: {
			compass: {
				options: {
					livereload: false
				},
				files: [
					'<%= yeoman.app %>/styles/**/*.scss',
					'!<%= yeoman.app %>/styles/bootstrap/**'
				],
				tasks: ['compass:server']
			},
			livereload: {
				options: {
					nospawn: true,
					livereload: liveReloadPort
				},
				files: [
					'<%= yeoman.app %>/**/*.html',
					'<%= yeoman.app %>/**/*.js',
					'<%= yeoman.app %>/**/*.css',
					'<%= yeoman.app %>/**/*.cur',
					'<%= yeoman.app %>/**/{,*/}*.{png,jpg,jpeg}',
					'!<%= yeoman.app %>/scripts/vendor/**',
					'!<%= yeoman.app %>/components/**'
				]
			}
		},
		connect: {
			options: {
				port: serverPort,
				hostname: '0.0.0.0'
			},
			livereload: {
				options: {
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder(connect, yeomanConfig.src)
						];
					}
				}
			}
		},
		clean: {
			dist: ['<%= yeoman.dist %>/*', '<%= yeoman.app %>/styles/main.css']
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/scripts/**/*.js'
			]
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			},
			dev: {
				configFile: 'karma.conf.js',
				singleRun: false,
				autoWatch: true
			},
			coverage: {
				configFile: 'karma.conf.js',
				preprocessors: util.mergeForCoverage(coverageFiles),
				singleRun: true,
				reporters: 'coverage'
			}
		},
		compass: {
			options: {
				config: '.compass.rb',
				sassDir: '<%= yeoman.app %>/styles',
				cssDir: '<%= yeoman.app %>/styles',
				imagesDir: '<%= yeoman.app %>/images',
				javascriptsDir: '<%= yeoman.app %>/scripts',
				fontsDir: '<%= yeoman.app %>/styles/fonts',
				importPath: '<%= yeoman.app %>/components',
				relativeAssets: false
			},
			dist: {
				options: {
					debugInfo: false
				}
			},
			server: {
				options: {
					debugInfo: true
				}
			}
		},
		concat: {
			dist: {
				files: {
					'<%= yeoman.dist %>/scripts/scripts.js': [
						'<%= yeoman.app %>/scripts/*.js'
					]
				}
			}
		},
		useminPrepare: {
			html: '<%= yeoman.app %>/index.html',
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
			options: {
				dirs: ['<%= yeoman.dist %>']
			}
		},
		imagemin: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= yeoman.app %>/images',
						src: '{,*/}*.{png,jpg,jpeg}',
						dest: '<%= yeoman.dist %>/images'
					}
				]
			}
		},
		cssmin: {
			dist: {
				files: {
					'<%= yeoman.dist %>/styles/main.css': ['<%= yeoman.app %>/styles/*.css']
				}
			}
		},
		ngmin: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= yeoman.dist %>',
						src: '**/*.js',
						dest: '<%= yeoman.dist %>'
					}
				]
			}
		},
		uglify: {
			dist: {
				files: {
					'<%= yeoman.dist %>/scripts/scripts.js': [
						'<%= yeoman.dist %>/scripts/scripts.js'
					]
				}
			}
		},
		hashres: {
			dist: {
				options: {
					fileNameFormat: '${name}.${ext}?${hash}',
					renameFiles: false
				},
				src: [
					'<%= yeoman.dist %>/**/*.js',
					'<%= yeoman.dist %>/**/*.css',
					'<%= yeoman.dist %>/**/*.{png,jpg,jpeg,gif}'
				],
				dest: ['<%= yeoman.dist %>/**/*.html', '<%= yeoman.dist %>/styles/*.css']
			}
		},
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= yeoman.app %>',
						dest: '<%= yeoman.dist %>',
						src: [
							'*.{ico,txt}',
							'components/**/*.*',
							'images/**/*.{cur,gif}',
							'scripts/vendor/**/*.*',
							'styles/fonts/**/*.*',
							'styles/custom/**/*.*',
							'pages/**/*.{css,htc,swf}',
							'**/*.html'
						]
					}
				]
			}
		},
		combine: {
			index: {
				input: "<%= yeoman.dist %>/index.html",
				output: "<%= yeoman.dist %>/index.html",
				tokens: [
					{
						token: '<script src="scripts/',
						string: '<script src="<%= yeoman.cloudfrontUrl %>/<%= yeoman.s3DistFolder %>/Admin/scripts/'
					},
					{
						token: '<script src="components/',
						string: '<script src="<%= yeoman.cloudfrontUrl %>/<%= yeoman.s3DistFolder %>/Admin/components/'
					}
				]
			}
		},
		s3: {
			push: {
				key: 'testKey',
				secret: 'testSecret',
				bucket: 'if-admin-web',
				region: 'us-west-2',
				gzip: true,
				access: 'public-read',
				maxOperations: 5,
				upload: [
					{
						src: '<%= yeoman.dist %>/**/*.*',
						rel: '<%= yeoman.dist %>',
						dest: '<%= yeoman.s3DistFolder %>/Admin'
					}
				]
			}
		}
	});

	grunt.registerTask('server', [
		'compass:server',
		'connect:livereload',
		'watch'
	]);

	grunt.registerTask('server:fastcss', [
		'connect:livereload',
		'watch:livereload'
	]);

	grunt.registerTask('test', [
		'compass',
		'karma:unit'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'compass:dist',
		'copy',
		'useminPrepare',
		'imagemin',
		'cssmin',
		'concat',
		'usemin',
		'ngmin',
		'uglify',
		'hashres',
		'combine:index',
		's3:push'
	]);

	grunt.registerTask('coverage', 'Specify a file to check for for coverage.', function (n) {
		var target = grunt.option('target');

		if (!target) {
			grunt.task.run('karma:coverage');
			return;
		}

		var newFiles = util.mergeForCoverage([target]);
		grunt.config.set('karma.coverage.preprocessors', newFiles);
		grunt.task.run('karma:coverage');
	});

	grunt.registerTask('default', ['build']);
	grunt.registerTask('update', ['exec:git_update']);
};
