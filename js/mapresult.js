//サーバー
const SERVER_DIR_IMG = "http://mkbtm.net/geo_mapping/images/";
const SERVER_FILE_CSV = "http://mkbtm.net/geo_mapping/data/data.txt"
const API_FILE_GET = "http://pluscreative.sakura.ne.jp/suga/mapresult/fileget.php";

//CSVの参照用
const CSV_KEY_LAT 		= 0;
const CSV_KEY_LNG 		= 1;
const CSV_KEY_TITLE 	= 2;
const CSV_KEY_NAME	 	= 3;
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
				var lt = $("#list-view-wrapper").scrollTop();
				var lp = $("#list-view-wrapper").position();
				var pos = mp.top + lt - lp.top;
				$("#list-view-wrapper").animate({scrollTop: pos},"slow", "swing");
				//ノードをアクティブ表示
				$('.media').removeClass("active");
				$("#media-node-"+index).addClass("active");				
			});
			
			
			//画像が保存されているかチェックしてあれば、マーカーを画像に変更します
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
		});
		
		//検索フォーム表示
		$('#list-view-wrapper .input-group').removeClass("hidden");
		
		//マーカーを全部おいたら地図の拡大率設定
		map.fitBounds(bounds);
		
	}
	
	/*
		リストビューにノードを追加します
	*/
	function addNode2ListView(element, index){
		
		var imgURL  = SERVER_DIR_IMG + element[CSV_KEY_IMG];
		
		var media = '<div id="media-node-'+index+'"class="media" data-list-index="'+index+'"><div class="media-left media-middle"><a href="'+imgURL+'" target="_blank"><img src="'+imgURL+'" class="media-object"  style="width: 80px; height: 80px; alt="写真"></a></div><div class="media-body"><h4 class="media-heading">'+element[CSV_KEY_TITLE]+'</h4><p class="media-comment">'+element[CSV_KEY_COMMENT]+'</p><p class="small">登録者: '+element[CSV_KEY_NAME]+'<br>カテゴリー: '+element[CSV_KEY_CATEGORY]+'</p><p class="media-position">'+element[CSV_KEY_LAT]+','+element[CSV_KEY_LNG]+'</p></div></div>';
		
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
	
	
	//
	//検索フォーム
	//
	$('#btn-search-all').click(function(){ 		searchNode($(this).attr("id")); });
	$('#btn-search-title').click(function(){ 	searchNode($(this).attr("id")); });
	$('#btn-search-name').click(function(){ 	searchNode($(this).attr("id")); });
	$('#btn-search-category').click(function(){ searchNode($(this).attr("id")); });
	$('#btn-show-all').click(function(){		searchNode($(this).attr("id")); });
	
	function searchNode(searchCase){		
		//検索キーワード取得
		var keyword = $('#text-keyword').val();
		
		//配列から検索
		makerDataAry.forEach(function(element, index, ary){	
			
			//ノードを表示するフラグ
			var flg = false;
			
			//ケースによってサーチする範囲を設定
			switch (searchCase){
				case 'btn-search-title':
					if(element[CSV_KEY_TITLE].indexOf(keyword) != -1){ flg = true; }
					break;
				case 'btn-search-name':
					if(element[CSV_KEY_NAME].indexOf(keyword) != -1){ flg = true; }
					break;
				case 'btn-search-category':
					if(element[CSV_KEY_CATEGORY].indexOf(keyword) != -1){ flg = true; }
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
			}else{
				//keywordが含まれないノードは非表示
				$("#media-node-"+index).addClass("hidden");
			}
		});
	}
	
	//textフィールドイベントチェック
	$('#text-keyword').change(function() {
		//空だったら全部のノード表示
		var val = $('#text-keyword').val();
		if(!val || val==""){
			$('.media').removeClass("hidden");
		}
	});
	
});
