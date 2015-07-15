//サーバー
const SERVER_DIR_IMG = "http://mkbtm.net/geo_mapping/images/";
const SERVER_FILE_CSV = "http://mkbtm.net/geo_mapping/data/data.txt"
const API_FILE_GET = "http://pluscreative.sakura.ne.jp/suga/mapresult/fileget.php";

//定数
const SEARCH_UNSELECTED =  "未選択";

//CSVの参照用
const CSV_KEY_LAT 		= 0;
const CSV_KEY_LNG 		= 1;
const CSV_KEY_TITLE 	= 2;
const CSV_KEY_AUTHOR	= 3;
const CSV_KEY_COMMENT 	= 4;
const CSV_KEY_IMG 		= 5;
const CSV_KEY_CATEGORY	= 6;

/* csvデータパターン 20150714
37.916265614681265,
139.08462707162533,
テスト1,名前,
これもテストでコメントを入れています。,
2015-07-09-110306.jpg,
カテゴリー
*/
		

//Google Maps
var map;
//csvの配列
var makerDataAry;
//Marker
var markers = [] ;
//選択中のマーカー
var highlightMaker;
//選択中のマーカーの情報ウィンドウ
var infoWindow;
//投稿者名リスト
var authorAry = [];
//カテゴリーリスト
var categoryAry = [];


$(function(){
    
/*
    //現在位置を取得する
	navigator.geolocation.getCurrentPosition(successFunc,errorFunc,optionObj);
	
	//成功した時の関数
	function successFunc(position){
		//マップを表示
		
		//取得したデータの整理
		var data = position.coords;

		//データの整理
		var lat = data.latitude;
		var lng = data.longitude;

		//makeMap(37.9181183, 139.0548581);
	}
	
*/
	
/*
	//失敗した時の関数
	function errorFunc(error){
		//エラーコードのメッセージを定義
		var errorMessage = {
			0: "原因不明のエラーが発生しました…。",
			1: "位置情報の取得が許可されませんでした…。",
			2: "電波状況などで位置情報が取得できませんでした…。",
			3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。",
		};
	
		//エラーコードに合わせたエラー内容を表示
		alert(errorMessage[error.code]);
	}
	
	//オプション・オブジェクト
	var optionObj = {
		"enableHighAccuracy": false,
		"timeout": 8000,
		"maximumAge": 5000,
	}
*/
	
	//なんとなく万代のあたりを初期位置に
	makeMap(37.9181183, 139.0548581);
	
	
	/*
		Google Mapsを生成します				
	*/
	function makeMap(lat, lng){
    	
	    //キャンパスの要素を取得します
		var canvas = document.getElementById( "map-canvas" );
		
		//中心の位置座標を指定します
		var latlng = new google.maps.LatLng( lat , lng );

	    var mapOptions = {
			zoom: 15 ,				//ズーム値
			center: latlng, 		//中心座標 [latlng]
		};

	    map = new google.maps.Map( canvas , mapOptions );
	    
	    
	    //マーカーを生成します
	    getMakerData();
    }
    
    /*
		csvを取得します
	*/
    function getMakerData(){
	   
	    $.ajax({
		  type: "POST",
		  url: API_FILE_GET,
		  dataType: "text",
		  data: { url: SERVER_FILE_CSV },
		  global: false,
		})
		.done(function(data) {
			//csvを配列にして保持します
			makerDataAry = $.csv.toArrays(data);
			
			//マーカー	
			makeMaker(makerDataAry);
			
		})
		.fail(function() {
			//通信エラー
			alert("通信に失敗しました。再読み込みをお試し下さい。")
		})
		.always(function() {
			//処理完了
		});
    }
    
    /*
		マーカーを生成します
	*/
    function makeMaker(makerDataAry){
		//バウンスを指定するために保持します
		var bounds = new google.maps.LatLngBounds();
						    
	    //マーカーを作成、設置する
	    makerDataAry.forEach(function(element, index, ary){
		    
		    var pos = new google.maps.LatLng(element[CSV_KEY_LAT],element[CSV_KEY_LNG] );
		    
		    //位置情報を保持
		    bounds.extend(pos);
			
			//マーカー生成
			markers[index] = new google.maps.Marker({
				map: map ,
				position: pos,
				animation: google.maps.Animation.DROP,
				title: element[CSV_KEY_TITLE],
			});
			
			// マーカークリックイベントの作成
			google.maps.event.addListener( markers[index], "click", function() {
				//マップをピンの位置まで移動します
				map.panTo(markers[index].getPosition());				
				//情報ウィンドウ表示します
				showInfoWindow(markers[index]);		
				//リストビューで該当のノードを表示します	
				var mp = $("#media-node-"+index).position() ;
				var lt = $("#map-menu-wrapper").scrollTop();
				var lp = $("#map-menu-wrapper").position();
				var pos = mp.top + lt - lp.top;
				$("#map-menu-wrapper").animate({scrollTop: pos},"slow", "swing");
				//ノードをアクティブ表示
				$('.media').removeClass("active");
				$("#media-node-"+index).addClass("active");				
			});
			
			
			//画像が保存されているかチェックして、あればマーカーを画像に変更します
/*
			var imgURL  = SERVER_DIR_IMG + element[CSV_KEY_IMG];
			$.post(API_FILE_GET,
			  { url: imgURL },
			  function(data){
			  	if(data){
					var icon = new google.maps.MarkerImage(
					imgURL,
					new google.maps.Size(34,34),
					new google.maps.Point(0,0),
					new google.maps.Point(37,34));

					markers[index].setIcon(icon); 
			  	}
			  }
			);
*/
			
			//リストビューに追加
			addNode2ListView(element, index);
			
			//投稿者を重複しないように保持
			if($.inArray(element[CSV_KEY_AUTHOR], authorAry ) == -1){
				authorAry.push(element[CSV_KEY_AUTHOR]);
			}
			
			//カテゴリーを重複しないように保持
			if($.inArray(element[CSV_KEY_CATEGORY], categoryAry ) == -1){
				categoryAry.push(element[CSV_KEY_CATEGORY]);
			}
		});
		
		//マーカーを全部おいたら地図の拡大率設定
		map.fitBounds(bounds);
		
		//検索メニュー生成
		makeSearchMenu();
	}
	
	/*
		リストビューにノードを追加します
	*/
	function addNode2ListView(element, index){
		
		var imgURL  = SERVER_DIR_IMG + element[CSV_KEY_IMG];
		
		var media = '<div id="media-node-'+index+'"class="media" data-list-index="'+index+'"><div class="media-left media-middle"><a href="'+imgURL+'" target="_blank"><img src="'+imgURL+'" class="media-object"  style="width: 80px; height: 80px; alt="写真"></a></div><div class="media-body"><h4 class="media-heading">'+element[CSV_KEY_TITLE]+'</h4><p class="media-comment">'+element[CSV_KEY_COMMENT]+'</p><p class="small">登録者: '+element[CSV_KEY_AUTHOR]+'<br>カテゴリー: '+element[CSV_KEY_CATEGORY]+'</p><p class="media-position">'+element[CSV_KEY_LAT]+','+element[CSV_KEY_LNG]+'</p></div></div>';
		
		$(media).appendTo($('#list-view-wrapper')).click(function(event){
			//タグからマーカーのindexを取得します
			var index = $(event.currentTarget).data('list-index');
			//表示するマーカーを取得
			highlightMaker = markers[index];
			//マップをピンの位置まで移動します
			map.panTo(highlightMaker.getPosition());
			//ピンのアニメーション
			highlightMaker.setAnimation( google.maps.Animation.DROP ) ;						
			//情報ウィンドウ表示
			showInfoWindow(highlightMaker);	
			//ノードをアクティブ表示
			$('.media').removeClass("active");
			$(event.currentTarget).addClass("active");
		});
	}
	
	
	//情報ウィンドウ
	function showInfoWindow(targetMaker){
		//既に表示していたらクローズ
		if(infoWindow){
			infoWindow.close();
		}
		
		//情報ウィンドウ生成
		infoWindow = new google.maps.InfoWindow({
			content: targetMaker.getTitle() ,
		});
		
		//表示
		infoWindow.open(targetMaker.getMap(), targetMaker);
	}
	
	
	/*
		検索フォーム
	*/
	$('#btn-submit').click(function(){
		//バウンスを指定するために保持します
		var bounds = new google.maps.LatLngBounds();
		//タイトル検索用のキーワード
		var keyTitle = $('#text-keyword').val();
		//投稿者検索用のキーワード
		var keyAuthor = $('#select-search-author option:selected').val();
		//カテゴリー検索用のキーワード
		var keyCategory = $('#select-search-category option:selected').val();
		//条件にヒットしたフラグ
		var hit = false;
		
		//マーカーの配列から検索
		makerDataAry.forEach(function(element, index, ary){	
			///検索条件で絞込
			var flg;
			flg = (element[CSV_KEY_TITLE].indexOf(keyTitle) != -1 || keyTitle == "")						?  true : false; 
			flg = (flg && (element[CSV_KEY_AUTHOR] == keyAuthor || keyAuthor == SEARCH_UNSELECTED)) 		?  true : false; 
			flg = (flg && (element[CSV_KEY_CATEGORY] == keyCategory || keyCategory == SEARCH_UNSELECTED)) 	?  true : false; 
			
			//ノードの表示・非表示
			if(flg){
				//keywordを含む場合表示
				$("#media-node-"+index).removeClass("hidden");
				markers[index].setOptions({visible:true});
				
				//位置情報を保持
				bounds.extend(markers[index].getPosition());
				//ヒットフラグ
				hit = true;
			}else{
				//keywordが含まれないノード・マーカーは非表示
				$("#media-node-"+index).addClass("hidden");
				markers[index].setOptions({visible:false});
			}
		});
		
		//一件以上ヒットしたら
		if(hit){
			//リストビュータブをアクティブ
			activeTabView('tab-view'); 
		
			//地図の拡大率設定
			map.fitBounds(bounds);
		}else{
			//Warning表示
			$('#non-item-alert').slideDown().delay(2000).slideUp();
		}
	});
/*
	
	$('#btn-search-all').click(function(){ 			searchNode($(this).attr("id"), $('#text-keyword').val()); });
	$('#btn-search-title').click(function(){ 		searchNode($(this).attr("id"), $('#text-keyword').val()); });
	$('#select-search-author').change(function(){ 	searchNode($(this).attr("id"), $('#select-search-author option:selected').val()); });
	$('#select-search-category').change(function(){ searchNode($(this).attr("id"), $('#select-search-category option:selected').val()); });
	$('#btn-show-all').click(function(){			searchNode($(this).attr("id"), ""); });
	
	function searchNode(searchCase, keyword){
		
		//未選択を選択した場合処理しない
		if(keyword == "未選択"){
			return;
		}
		
		//バウンスを指定するために保持します
		var bounds = new google.maps.LatLngBounds();
			
		//マーカーの配列から検索
		makerDataAry.forEach(function(element, index, ary){	
			
			//ノードを表示するフラグ
			var flg = false;
			
			//ケースによってサーチする範囲を設定
			switch (searchCase){
				case 'btn-search-title':
					if(element[CSV_KEY_TITLE].indexOf(keyword) != -1){ flg = true; }
					break;
				case 'select-search-author':
					if(element[CSV_KEY_AUTHOR] == keyword){ flg = true; }
					break;
				case 'select-search-category':
					if(element[CSV_KEY_CATEGORY] == keyword){ flg = true; }
					break;
				case 'btn-show-all':
					flg = true;
					break;
				default:
					//全部検索
					element.forEach(function(txt, elementndex, ary){
						if(txt.indexOf(keyword) != -1){
							flg = true;
						}
					});
					break;
			}
			
			//ノードの表示・非表示
			if(flg){
				//keywordを含む場合表示
				$("#media-node-"+index).removeClass("hidden");
				markers[index].setOptions({visible:true});
				
				//位置情報を保持
				bounds.extend(markers[index].getPosition());
			}else{
				//keywordが含まれないノード・マーカーは非表示
				$("#media-node-"+index).addClass("hidden");
				markers[index].setOptions({visible:false});
			}
		});
		
		//リストビュータブをアクティブ
		activeTabView('tab-view'); 
		
		//地図の拡大率設定
		map.fitBounds(bounds);
	}
*/
	
	//textフィールドイベントチェック
/*
	$('#text-keyword').change(function() {
		//空だったら全部のノード表示
		var val = $('#text-keyword').val();
		if(!val || val==""){
			$('.media').removeClass("hidden");
		}
	});
*/
	
	
	/*
		タブバーの切り替え
	*/
	$('#tab-view').click(function(){ activeTabView('tab-view'); });
	$('#tab-search').click(function(){ activeTabView('tab-search'); });
	
	function activeTabView(type){
		if(type == "tab-view"){
			$('#tab-view').addClass("active");
			$('#tab-search').removeClass("active");
			$('#search-view-wrapper').addClass("hidden");
			$('#list-view-wrapper').removeClass("hidden");
		}else{
			$('#tab-search').addClass("active");
			$('#tab-view').removeClass("active");
			$('#list-view-wrapper').addClass("hidden");
			$('#search-view-wrapper').removeClass("hidden");
		}
		
		changeViewHeight(type);
	}
	
	//ビューの高さ変更
	function changeViewHeight(type){
		if(type == "tab-view"){
			$("#map-canvas-wrapper").animate({ height: "50%"}, 500 );
			$("#map-menu-wrapper").animate({ height: "50%"}, 500 );
		}else{
			$("#map-canvas-wrapper").animate({  height: "30%" }, 500 );
			$("#map-menu-wrapper").animate({ height: "70%"}, 500 );
		}		
	}
	
	
	/*
		検索の投稿者名・カテゴリーのリスト生成
	*/
	function makeSearchMenu(){
		//投稿者リスト
		authorAry.forEach(function(element, index, ary){
			var node = "<option valur='"+element+"'>"+element+"</option>";
			$(node).appendTo('#select-search-author');
		});
		
		//カテゴリーリスト
		categoryAry.forEach(function(element, index, ary){
			var node = "<option valur='"+element+"'>"+element+"</option>";
			$(node).appendTo('#select-search-category');
		});
	}
	
});
