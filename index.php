<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>検索結果のページ</title>
    
	<!-- Bootstrap Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
	
	<!-- mapresult.css -->
	<link rel="stylesheet" href="http://pluscreative.sakura.ne.jp/suga/mapresult/css/mapresult.css">
	
	<body>
	    
	    <div id="main-wrapper">
		    
		    <div class="alert alert-danger hidden" role="alert">
			  <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
			  <span class="sr-only">Error:</span>
			  Enter a valid email address
			</div>

		    <div id="map-canvas-wrapper">
				<div id="map-canvas" ></div>
			</div>
			
			<div id="map-menu-wrapper">
				<div id="nav-tab-area">
					<ul class="nav nav-tabs">
						<li id="tab-view" role="presentation" class="active"><a href="#">リスト表示</a></li>
						<li id="tab-search" role="presentation"><a href="#">リスト検索</a></li>
					</ul>
				</div>
				
				<div id="search-view-wrapper" class="hidden">
					<form class="form-horizontal">
						<div class="form-parts">
						    <label for="inputTitle" class="control-label">タイトル検索</label>
						    <input id="text-keyword" type="text" class="form-control" placeholder="キーワードを入力してください...">
						</div>
						
						<div class="form-parts">
						    <label for="inputAuthor" class="control-label">投稿者検索</label>
						    <select id="select-search-author" class="form-control">
								<option value="未選択">未選択</option>
							</select>
						</div>						
						
						<div class="form-parts">
						    <label for="inputCategory" class="control-label">カテゴリー検索</label>							
					    	<select id="select-search-category" class="form-control">
								<option value="未選択">未選択</option>
							</select>
						</div>
						
						<div class="form-parts">
<!-- 						<a id="btn-show-all" class="btn btn-default" href="#" role="button">すべて表示</a> -->
							<button id="btn-submit" type="button" class="btn btn-default btn-lg btn-block">検索</button>
						</div>
					</form>
				</div>
	
				<div id="list-view-wrapper"></div>
			</div>
			
	    </div><!-- id="main-wrapper" -->
	    	    
		<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
	    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	    
	    <!-- jquery.csv -->
	    <script src="http://pluscreative.sakura.ne.jp/suga/mapresult/js/jquery.csv-0.71.min.js"></script>
	    
		<!-- Googlemaps API -->
	    <script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBYoK9bDfwqk7dv0wW3FdULswasNh3sdgg&sensor=true"></script>
    
		<!-- Bootstrap Latest compiled and minified JavaScript -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
		
		<!-- mapresult -->
		<script src="http://pluscreative.sakura.ne.jp/suga/mapresult/js/mapresult.js"></script>
		
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		
		  ga('create', 'UA-65047538-1', 'auto');
		  ga('send', 'pageview');
		
		</script>
		
  </body>
  
</html>