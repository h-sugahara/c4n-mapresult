//サーバー
const SERVER_DIR_IMG = "http://mkbtm.net/geo_mapping/images/";
const API_FILE_GET = "http://pluscreative.sakura.ne.jp/suga/mapresult/fileget.php";

//CSVの参照用
const CSV_KEY_LAT 		= 0;
const CSV_KEY_LNG 		= 1;
const CSV_KEY_TITLE 	= 2;
const CSV_KEY_COMMENT 	= 3;
const CSV_KEY_IMG 		= 4;

/* csvデータパターン
37.916265614681265,
139.08462707162533,
テスト1,
これもテストでコメントを入れています。,
2015-07-09-110306.jpg
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
		  data: { url: "http://mkbtm.net/geo_mapping/data/data.txt" },
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
		//map.fitBounds(bounds);
		
	}
	
	/*
		リストビューにノードを追加します
	*/
	function addNode2ListView(element, index){
		
		var imgURL  = SERVER_DIR_IMG + element[CSV_KEY_IMG];
		
		var media = '<div id="media-node-'+index+'"class="media" data-list-index="'+index+'"><div class="media-left media-middle"><a href="'+imgURL+'" target="_blank"><img src="'+imgURL+'" class="media-object"  style="width: 80px; height: 80px; alt="写真"></a></div><div class="media-body"><h4 class="media-heading">'+element[CSV_KEY_TITLE]+'</h4><p class="media-comment">'+element[CSV_KEY_COMMENT]+'</p><p class="media-position">'+element[CSV_KEY_LAT]+','+element[CSV_KEY_LNG]+'</p></div></div>';
		
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
	
	
	//ノード検索
	$('#btn-submit').click(function(){
		console.log($('#text-keyword').val());	
		
		var val = $('#text-keyword').val();
		
		//配列から検索
		makerDataAry.forEach(function(element, index, ary){
			//配列に含まれてる？
			var res = $.inArray(val, element);
			
			if(0 > res){
				//keywordが含まれないノードは非表示
				$("#media-node-"+index).addClass("hidden");
			}else{
				//keywordを含む場合表示
				$("#media-node-"+index).removeClass("hidden");
			}
		});
	});
	
	//textフィールドイベントチェック
	$('#text-keyword').change(function() {
		
		//空だったら全部のノード表示
		var val = $('#text-keyword').val();
		if(!val || val==""){
			$('.media').removeClass("hidden");
		}
	});
	
});
