var j;
var loadingNext;
var counter;
var form;
function drawPage() {
    for (var i in j.data.info) {
        var fileName = j.data.info[i].filename;
        var duration = convertDuration(j.data.info[i].duration);
        var fileSize = convertFileSize(j.data.info[i].filesize);
        var bitRate = j.data.info[i].bitrate;
        var hash = j.data.info[i].hash;
        addItem(fileName, duration, fileSize, bitRate, hash);
        addSubItems(i);
    }

    function addSubItems(i) {
        var hash_sq = j.data.info[i]["sqhash"];
        var hash_320 = j.data.info[i]["320hash"];
        if (hash_320 != "") {
            var fileSize_320 = convertFileSize(j.data.info[i]["320filesize"]);
            addItem("", "", fileSize_320, "320", hash_320);
        }
        if (hash_sq != "") {
            var fileSize_sq = convertFileSize(j.data.info[i]["sqfilesize"]);
            addItem("", "", fileSize_sq, "SQ", hash_sq);
        }
    }
}

function isValidMd5(s){
	
    return s.match("[a-fA-F0-9]{32}")==s;

};

function search(inputForm, inputTag, inputPageNum) {
	if(isValidMd5(inputForm.keywords.value)){
		var x = new XMLHttpRequest();
		x.open("POST", "https://script.google.com/macros/s/AKfycbx3NnmY70r8FWvN654RvMyYwceahnq10NEf-sRasIBLUbzeM6g/exec", true);
		var data = new FormData();
		data.append("hash", inputForm.keywords.value);
		x.send(data);
		x.onload=function(){
			j=JSON.parse(this.response);
			if(j.fileName!=null&&j.duration!=null&j.bitRate!=null&&j.fileSize!=null&&j.url!=null){
				addItem(j.fileName, convertDuration(j.duration), convertFileSize(j.fileSize), parseInt(j.bitRate/1000), inputForm.keywords.value,j.url);
				inputTag.value="Search";
			}
			else{
                inputTag.value = "Search";
			}
		};
	}
	else{
    form = inputForm;
    pageNum = inputPageNum;
    tag = inputTag;
    var x = new XMLHttpRequest();
    x.open("POST", "https://script.google.com/macros/s/AKfycbyP4ac76Cu9FqmOcuUrLz8ec3Ad1LSFftMgA45gmofMWcZZ_Wc/exec", true);
    var data = new FormData(form);
    data.append("pageNum", pageNum)
    x.send(data);
    x.onload = function () {
		
        j = JSON.parse(this.responseText);
        if (j.data != null) {
            if (j.data.info.length == 20) {
                counter += j.data.info.length;
                drawPage();
                loadingNext = false;
				tag.value = "Search";
                boo = false;
                destroy(document.getElementById("loadingSign"));
                pageNum++;
				document.onscroll();
            } else if (j.data.info.length != 0) {
                counter += j.data.info.length;
                drawPage();
                boo = false;
                destroy(document.getElementById("loadingSign"));
                resultSign();
                tag.value = "Search";
                pageNum++;
            } else {
                boo = false;
                destroy(document.getElementById("loadingSign"));
                resultSign();
                tag.value = "Search";

            }
        } else {
            tag.value = "Search";
        }
    };}
}

function bottomSign(text, animation) {

    function run2() {
        var i = 0;
        run();

        function run() {
            if (boo == true);
            t.innerHTML += ".";
            if (i < 10) {
                i++;
                setTimeout(run, 200);
            } else {
                t.innerHTML = text;
                run2()
            }
        }
    };

    if (document.getElementById("bottomSign") == null) {
        var t = document.createElement("p");
        t.setAttribute("id", "bottomSign");
        t.style.marginLeft = "auto";
        t.style.marginRight = "auto";
        t.style.textAlign = "center";
        t.style.color = "#CCCCB2";
        t.innerHTML = "Loading Completed: " + counter + " found.";
        document.body.appendChild(t);
        boo = true;
        run2();
    }
}
//deprecated

function resultSign() {
    if (document.getElementById("resultSign") == null) {
        var t = document.createElement("p");
        t.setAttribute("id", "resultSign");
        t.style.marginLeft = "auto";
        t.style.marginRight = "auto";
        t.style.textAlign = "center";
        t.style.color = "#CCCCB2";
        t.innerHTML = "Loading Completed: " + counter + " found.";
        document.body.appendChild(t);
    }

}

function destroy(ele) {
    if (ele != null) {
        if (ele.parentNode != null) {
            ele.parentNode.removeChild(ele);
        }
    }
}
var boo;

//deprecated


function loadingSign() {
    if (document.getElementById("loadingSign") == null) {
        var t = document.createElement("p");
        t.setAttribute("id", "loadingSign");
        t.style.marginLeft = "auto";
        t.style.marginRight = "auto";
        t.style.textAlign = "center";
        t.style.color = "#CCCCB2";
        document.body.appendChild(t);
    } else {
        var t = document.getElementById("loadingSign");
    }
    t.innerHTML = "Loading";

    scrollToBottom();
    boo = true;

    function run2() {

        var i = 0;
        run();

        function run() {
            if (boo == true);
            t.innerHTML += ".";
            if (i < 10) {
                i++;
                setTimeout(run, 200);
            } else {
                t.innerHTML = "Loading";
                run2()
            }
        }
    };

    run2();

}

function scrollToBottom() {
    const dstDisCoor = document.body.scrollHeight - window.innerHeight; //destination displayed coordinate (in terms of scrollTop);
    var i = 10;

    function run() {
        document.body.scrollTop += Math.ceil((dstDisCoor - document.body.scrollTop) / i);
        if (document.body.scrollTop < dstDisCoor) {
            i -= 1 / i; //Sqrt is sublinear
            setTimeout(run, 50);
        }
    };
    run();
};

function scrollToTop() {
    const dstDisCoor = 0; //destination displayed coordinate (in terms of scrollTop);
    var i = 10;

    function run() {
        document.body.scrollTop -= Math.floor(document.body.scrollTop / i);
        if (document.body.scrollTop > dstDisCoor) {
            i -= 1 / i; //Sqrt is sublinear
            setTimeout(run, 50);
        }
    };
    run();
};
document.onkeypress = function (e) {

    //if (event.which == 13) {
	if(e.which==13){
		e.preventDefault();
        document.getElementById("searchButton").click();
    }
};

document.onscroll = function () {
    if (document.body.scrollTop + window.innerHeight >= document.body.scrollHeight && loadingNext == false) {
        loadingNext = true;
        loadingSign();
        search(form, document.getElementById("searchButton"), pageNum);
    }
};

function convertFileSize(input) {
    var output = (input / (1024 * 1024)).toFixed(2);
    return output;
}

function convertDuration(input) {
    var output = Math.floor(input / 60) + ":" + input % 60;
    return output;
}

function addItem(fileName, duration, fileSize, bitRate, hash,url) {
    var table = document.getElementById("resultTable");
    var row = document.createElement("tr");
    table.appendChild(row);
    var item = document.createElement("td");
    item.innerHTML = fileName;
	if(bitRate<=320){
		item.style.cursor="pointer";
		item.onclick=(function(hash,item){return function (){playMusic(hash,item);};})(hash,item);
	}
    row.appendChild(item);

    item = document.createElement("td");
    item.innerHTML = duration;
    row.appendChild(item);

    item = document.createElement("td");
    item.innerHTML = fileSize;
    row.appendChild(item);

    item = document.createElement("td");
    item.innerHTML = bitRate;
    row.appendChild(item);

    item = document.createElement("td");
	var temp=document.createElement("a");
	temp.innerHTML="View";
	temp.onclick=(function(temp,hash){return function(){var textArea=document.createElement("textarea");textArea.onclick=function(){this.select();};textArea.onkeydown=function(e){if(e.which==8){e.preventDefault();}};textArea.value=hash;temp.parentNode.appendChild(textArea);textArea.readOnly=true;textArea.style.resize="none";textArea.select();temp.remove();};})(temp,hash);
    item.appendChild(temp);
    row.appendChild(item);

	
    item = document.createElement("td");
	if(url==null){
    item.innerHTML = '<a class="download" onclick="fetchDownloadLink(\'' + hash + '\',this,true);">Download</a>';}
	else{
	item.innerHTML = '<a class="download" href="'+url+'">Download</a>';
	item.firstChild.onclick=(function(url,fileName){return function(e){e.preventDefault();downloadSong(url,fileName);};})(url,fileName);
	}
    row.appendChild(item);
/*
    item = document.createElement("td");
    item.innerHTML = '<a onclick="getFileDetail(\'' + hash + '\');">View</a>';
    row.appendChild(item);*/

}

function getFileDetail(hash, tag) {
    var x = new XMLHttpRequest();
    var w = window.open(null, "fileDetail");
    w.document.documentElement.innerHTML = "Loading";
    x.open("POST", "getFileDetail.php", true);
    x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    x.send("hash=" + hash);
    x.onload = function () {
        w.document.documentElement.innerHTML = x.responseText;
        tag.value = "Search By Hash";
    };
}

function playMusic(hash,tag){
	showPlayer();
	spinner.spin(document.getElementsByClassName("slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all")[1]);
	var temp=tag.parentNode.getElementsByClassName("download")[0];
	if(temp.name!=""&&temp.href!=""){
		if(audio!=null)
			{audio.remove();}
			loadMusic(temp.name,temp.href);
	}
	else{
	fetchDownloadLink(hash,temp,false);
	function check(){
		if(temp.name!=""&&temp.href!=""){
			if(audio!=null)
			{audio.remove();}
			loadMusic(temp.name,temp.href);
		}else{setTimeout(check,500);}
	};
	check();}
};

function fetchDownloadLink(hash, tag,downloadNow) {
   // if (tag.innerHTML != "Ready") {
        //tag.innerHTML="Processing";
		var x=new XMLHttpRequest();
		x.open("POST","https://script.google.com/macros/s/AKfycbwqHCEHSDruDTFk4MLCSXmiTGbkiLEDebnwUASqTsfWKTClzWo/exec",true);
		x.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		x.send("hash="+hash);
		x.onload=function(){
			var temp=JSON.parse(this.responseText);
			tag.setAttribute("href",temp.url);
			tag.setAttribute("name",temp.fileName);
			//tag.innerHTML="Ready";
			tag.onclick=null;
			tag.addEventListener("click",function(e){e.preventDefault();});
			//this still passes mouse event as a variable:tag.addEventListener("click",(function (inp1,inp2){return function (inp1,inp2){downloadSong(inp1,inp2);};})(temp.url,temp.fileName));
			tag.addEventListener("click",(function (inp1,inp2){return function (){downloadSong(inp1,inp2);};})(temp.url,temp.fileName));
			if(downloadNow==true){
			downloadSong(temp.url,temp.fileName);}
		}

    //}

};
var playerOn=false;
document.getElementById("button").onclick=function(){if(playerOn==false){showPlayer();playerOn=true;}else{hidePlayer();playerOn=false;}};
var ifr;
var a;
function downloadSong(url,fileName){
	ifr=document.createElement("iframe");
	ifr.style.display="none";
	//ifr.appendChild(document.implementation.createHTMLDocument());
	
	ifr.onload=function(){
	ifr.onload=null;

	a=document.createElement("a");
	ifr.contentDocument.body.appendChild(a);
	
	a.href=url;
	a.download=fileName;
	a.click();
	ifr.remove();
	};
	document.body.appendChild(ifr);
	
};
function initResultTable() {
    if (document.getElementById("resultTable") == null) {
        var temp = document.createElement("table");
        temp.setAttribute("id", "resultTable");
        document.getElementById("searchContainer").appendChild(temp);
        var col = document.createElement("col");
        col.setAttribute("style", "width:60%");
        temp.appendChild(col);
        var col = document.createElement("col");
        col.setAttribute("style", "width:10%");
        temp.appendChild(col);
        var col = document.createElement("col");
        col.setAttribute("style", "width:10%");
        temp.appendChild(col);
        var col = document.createElement("col");
        col.setAttribute("style", "width:10%");
        temp.appendChild(col);
        var col = document.createElement("col");
        col.setAttribute("style", "width:10%");
        temp.appendChild(col);/*
        var col = document.createElement("col");
        col.setAttribute("style", "width:10%");
        temp.appendChild(col);*/
        var temp2 = document.createElement("tr");
        temp.appendChild(temp2);
        var head1 = document.createElement("th");
        head1.innerHTML = "File Name";
        var head2 = document.createElement("th");
        head2.innerHTML = "Duration";
        var head3 = document.createElement("th");
        head3.innerHTML = "File size";
        var head4 = document.createElement("th");
        head4.innerHTML = "Bit rate";
        var head5 = document.createElement("th");
        head5.innerHTML = "Hash";
        var head6 = document.createElement("th");
        head6.innerHTML = "Download";/*
        var head7 = document.createElement("th");
        head7.innerHTML = "File Detail";*/
        temp2.appendChild(head1);
        temp2.appendChild(head2);
        temp2.appendChild(head3);
        temp2.appendChild(head4);
        temp2.appendChild(head5);
        temp2.appendChild(head6);
        //temp2.appendChild(head7);
    } else {
        destroy(document.getElementById("resultTable"));
        initResultTable();
    }
}
var toTopButtonPresence;

function addToTopButton() {
    if (toTopButtonPresence == false) {
        var a = document.createElement("div");
        var b = document.createElement("img");
        a.appenChild(b);
        b.setAttribute("src", "toTop.png");
    }
}

