function loadXMLDoc()
{
	//请求
  var xmlhttp;
  if (window.XMLHttpRequest)
  {
	// IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
	xmlhttp = new XMLHttpRequest();
  }else{
	// IE6, IE5 浏览器执行代码
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  var a = form_in.wenben.value;
  var music_url = "http://175.178.190.32:3000/search?keywords="+a+"";
  filterHTML(music_url);
  checkIsXSS(music_url);
  //ajax请求json
  xmlhttp.onreadystatechange=function()
  {
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		//json转js对象，然而myArr只能在这个函数里有效
		var myArr = JSON.parse(this.responseText);
		myFunction(myArr);
	}
  }
  xmlhttp.open("GET",music_url,true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send();
}


function myFunction(arr) {
	var music_id = new Array();
	var music_name = new Array();
	var music_artist = new Array();
	//js对象取值
	console.log(arr);
	for (var i = 0 ; i < 7 ; i++){
		var id = arr.result.songs[i].id;
		music_id[i] = id;
		console.log(id);
		var name = arr.result.songs[i].name;
		music_name[i] = name;
		console.log(name);
		var artist = arr.result.songs[i].artists[0].name;
		music_artist[i] = artist;
		console.log(artist);
		/**var pic = arr.result.songs[i].artists[0].picUrl;
		music_pic[i] = pic;**/
	}
	
	var music_lrc = new Array();
	//回调函数，为啥用？因为要外部访问，对比上面那个ajax，就知道了
	for (var i = 0 ; i < music_id.length ; i++ ){
		var jsonData; // 全局变量
		$.ajax({
			type: "get",
			dataType: "json",
			async: false,
			url: 'http://175.178.190.32:3000/lyric?id='+music_id[i]+'',
			success: function (data) {
				jsonData = data;
			}
		});
		//能够确定外部能访问
		console.log(jsonData);
		var ans = jsonData.lrc.lyric;
		music_lrc[i] = ans;
	}
	
	var music_pic = new Array();
	for (var i = 0 ; i < music_id.length ; i++ ){
		var jsonData; // 全局变量
		$.ajax({
			type: "get",
			dataType: "json",
			async: false,
			url: 'http://175.178.190.32:3000/song/detail?ids='+music_id[i]+'',
			success: function (data) {
				jsonData = data;
			}
		});
		//能够确定外部能访问
		console.log(jsonData);
		var ans = jsonData.songs[0].al.picUrl;
		music_pic[i] = ans;
	}
	
	
	/**document.getElementById("music").src = "https://music.163.com/song/media/outer/url?id="+out+".mp3";**/
	//歌曲详情
	const ap = new APlayer({
		container: document.getElementById('aplayer'),
		volume: 0.7,
		mutex: true,
		preload: 'auto',
		listFolded: false,
		listMaxHeight: 90,
		lrcType: 1,
		audio: [
		{
			name: music_name[0],
			artist: music_artist[0],
			url: 'https://music.163.com/song/media/outer/url?id='+music_id[0]+'.mp3',
			cover: music_pic[0],
			lrc: music_lrc[0],
			theme: '#ebd0c2'
		},
		{
			name: music_name[1],
			artist: music_artist[1],
			url: 'https://music.163.com/song/media/outer/url?id='+music_id[1]+'.mp3',
			cover: music_pic[1],
			lrc: music_lrc[1],
			theme: '#ebd0c2'
		},
		{
			name: music_name[2],
			artist: music_artist[2],
			url: 'https://music.163.com/song/media/outer/url?id='+music_id[2]+'.mp3',
			cover: music_pic[2],
			lrc: music_lrc[2],
			theme: '#ebd0c2'
		},
		{
			name: music_name[3],
			artist: music_artist[3],
			url: 'https://music.163.com/song/media/outer/url?id='+music_id[3]+'.mp3',
			cover: music_pic[3],
			lrc: music_lrc[3],
			theme: '#ebd0c2'
		},
		{
			name: music_name[4],
			artist: music_artist[4],
			url: 'https://music.163.com/song/media/outer/url?id='+music_id[4]+'.mp3',
			cover: music_pic[4],
			lrc: music_lrc[4],
			theme: '#ebd0c2'
		},
		{
			name: music_name[5],
			artist: music_artist[5],
			url: 'https://music.163.com/song/media/outer/url?id='+music_id[5]+'.mp3',
			cover: music_pic[5],
			lrc: music_lrc[5],
			theme: '#ebd0c2'
		},
		{
			name: music_name[6],
			artist: music_artist[6],
			url: 'https://music.163.com/song/media/outer/url?id='+music_id[6]+'.mp3',
			cover: music_pic[6],
			lrc: music_lrc[6],
			theme: '#ebd0c2'
		}],
	});	
}

function filterHTML(v){
  //过滤匹配匹配的<>
  v = v.replace(/<.*?>/g,"");
  // 过滤只有<的
  v = v.replace(/<.*?/g,"");
  // 过滤只有>的
  v = v.replace(/.*?>/g,"");
  return v;
}
 
/*xss校验函数，返回值：true 表示存在xss漏洞，false：不存在*/
function checkIsXSS(v) {
	var res1 = (new RegExp("\\b(document|onload|eval|script|img|svg|onerror|javascript|alert)\\b")).test(v);
	var res2 = (new RegExp("<","g")).test(v);
	var res3 = (new RegExp(">","g")).test(v);
	return ((res1 == true) || (res2 == true) || (res3 == true));
}

const ap = new APlayer({
	container: document.getElementById('aplayer'),
	volume: 0.7,
    mutex: true,
	preload: 'auto',
	listFolded: false,
	listMaxHeight: 90,
	lrcType: 3,
	audio: [{
		name: 'cyber',
		artist: 'none',
		url: '../static/mp3/kamila.mp3',
		cover: '../static/img/cyber.png',
		lrc: '../static/mp3/lrc.lrc',
		theme: '#ebd0c2'
	},
	{
		name: '羽根',
		artist: '折戸伸治',
		url: '../static/mp3/羽根-折戸伸治.mp3',
		cover: '../static/img/air.jpg',
		lrc: '../static/mp3/羽根.lrc',
		theme: '#46718b'
	},
	{
		name: '夢と葉桜',
		artist: '初音ミク',
		url: '../static/mp3/夢と葉桜-初音ミク_青木月光-22856353.mp3',
		cover: '../static/img/初音.jpg',
		lrc: '../static/mp3/初音ミク&青木月光-夢と葉桜.lrc',
		theme: '#46718b'
	},
	{
		name: 'clear mind',
		artist: '遠藤正明',
		url: '../static/mp3/遠藤正明-Clear Mind.mp3',
		cover: '../static/img/不动游星.jpg',
		lrc: '../static/mp3/遠藤正明-Clear Mind.lrc',
		theme: '#46718b'
	}]
});
