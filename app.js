/**
*app.js
*
**/

var express = require("express");
var fs = require("fs");
var app = express();

function getBlogList(blogDir,callback) {
	fs.readdir(blogDir, function (err,files) {
		var blogList = [];
		// var blogItem = {"title" : "","url" : ""};
		var tempList = [];
		if (files && files.length) {
			files.forEach(function (filename) {
				//split file name and generate url...
				var suffix = [];
				// console.log(filename);
				suffix = filename.split(".");
				// console.log(suffix[1]);
				if("md" == suffix[1]) {
					tempList = suffix[0].split("-");
					if (tempList && tempList.length) {
						var blogItem = {"title" : "","url" : ""};	// blogItem必须定义在这里  不然第二次push时会覆盖了第一次的内容 因为插入的是同一个对象！！！ //确定一点：不是push的问题
						blogItem.title = tempList[4];
						blogItem.url = '/blog/' + tempList[0] + '/' +tempList[1] + '/' + tempList[2] + '/' + tempList[4]; 
						console.log(blogItem);
						blogList.push(blogItem);	// push可向数组的末尾添加一个或多个元素，并返回新的长度。
						console.log(blogList);		// 第二次push时覆盖了第一次的内容  确定一点：不是push的问题
					}
						// console.log(blogItem);
						
				} else {
					// var i = 0;
					console.log("Not .md Files");
				}
			});
		}
		console.log(blogList);
		callback(blogList);
		// return blogList;  // 异步执行导致返回的为空

	});

}

app.get('/',function(req,res) {
	var html = '';
	var blogList = [];
 	getBlogList('./blogs',function(blogList) {
 		// console.log(blogList);
 		if (blogList && blogList.length) {
			blogList.forEach(function (blog) {
				// console.log(blog);
				html += '<a href ="' + blog.url  + '">' +blog.title  + '</a><br/>';
		});
		res.send(html);
	} else {
			res.send('No Blogs Found.'); 
			}
	});

});

app.get('/blog/:year/:month/:day/:title',function(req,res) {
	
		var filename = 
		'./blogs/'+
		req.params.year + '-' +
		req.params.month + '-' +
		req.params.day + '-' +
	    'blog' + '-' +
		req.params.title + '.md';

	fs.readFile(filename, 'UTF-8',function(err,data) {	
		if (err) {
			res.send(err);
		} 
		res.send(data);
	});
});

/*自定义的404 Not Found页面*/

app.get('*', function (req, res) {
  res.send(404, "Oops! We didn't find it");
});

app.listen(3000);
console.log("server starting");