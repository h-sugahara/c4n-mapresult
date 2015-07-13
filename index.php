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
			
			<div id="list-view-wrapper">				
				<div class="input-group hidden">
			          <input type="text" id="text-keyword" class="form-control" placeholder="検索キーワードを入れてください...">
			          <span class="input-group-btn">
			            <button class="btn btn-default" id="btn-submit" type="button">検索</button>
			          </span>
					</form>
		        </div>
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