
<?php
// Connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "data_collect";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare SQL statement
$sql = "INSERT INTO data (force, touches) VALUES ('$force', '$touches')";

// Execute SQL statement
if ($conn->query($sql) === TRUE) {
    echo "Data inserted successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close connection
$conn->close();
?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
	<meta http-equiv="content-type" content="text/html" charset="utf-8" />
	<title>Drawing Development</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<link rel="StyleSheet" href="ipad_pro_11____1.css" />
	<script src="https://secure.exportkit.com/cdn/js/ek_googlefonts.js?v=6"></script>
	<meta http-equiv='X-UA-Compatible' content='IE=edge'>
	<!-- Add your custom HEAD content here -->

</head>

<body>

	<div id="content-container">

		<div id="page_ipad_pro_11____3_ek1">
			<div id="_bg__ipad_pro_11____3_ek2"></div>

			<div id="rectangle_1_ek2"></div>
			<div id="rectangle_6"></div>
			<div id="image_3"></div>
			<div id="rectangle_8">
				<canvas id="canvas" width="955px" height="250px"></canvas>
			</div>
			<div id="_1_1">
				<div id="force"></div><br>
				<div id="touches"></div><br>
				<!-- <div id="test"></div><br> -->
				<!-- <div id="timestamp"></div><br> -->
			</div>
			<div id="rectangle_9"></div>







			<div id="nextnext">
				<button id="_rectangle_4_ek1" class="next">ต่อไป</button>
			</div>




			<div id="apple_1"></div>
			<div id="lemon_1"></div>


			<div id="____________">
				<span
					class="char">%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%88%E0%B9%89%E0%B8%B2</span>
			</div>
			<div id="pointing2_1"></div>






			<!--ก๊อปก้อนนี้-->
			<a id="_rectangle_5_link" href="ipad_pro_11____2.html">
				<div id="_rectangle_5"></div>
			</a>
			<a id="___________link" href="ipad_pro_11____2.html">
				<div id="__________">
					<span class="char">%E0%B8%A2%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%A5%E0%B8%B1%E0%B8%9A</span>
				</div>
			</a>

			<!-- ปุ่มรีเฟรช -->
			<div class="refresh" onClick="undoDraw()">
				<div id="undo_circular_arrow_white_1"></div>
			</div>
			<!--ถึงนี้-->

			<div id="playy">
				<button id="play" class="button">"แตะ" เพื่อเริ่มขีดเส้น</button>
			</div>

			<!-- copy here ปุ่มบังคับ -->
			<style>
				.button {
					display: inline-block;
					padding: 45px 121px;
					font-size: 80px;
					font-family: 'caramello';
					cursor: pointer;
					text-align: center;
					text-decoration: none;
					outline: none;
					color: rgb(0, 0, 0);
					background-color: #F9F9C5;
					border: none;
					border-radius: 15px;
					z-index: 3;
					opacity: 0.8;
				}

				.next {
					width: 177px;
					height: 65px;
					border-radius: 10px;
					border: none;
					font-size: 33px;
					font-family: 'caramello';
					color: rgb(255, 255, 255);
					background-color: #30d5d0;
				}

				canvas {
					position: absolute;
					width: 100%;
					height: 100%;
				}
			</style>
			<!-- copy here ปุ่มบังคับ -->
			<script>
				document.getElementById("play").addEventListener("click", myFunction);
				function myFunction() {
					document.getElementById("play").disabled = true;
				}
			</script>



		</div>




		<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/fabric@5.2.4/dist/fabric.min.js"></script>
		<script src="index.js"></script>







		<!--sound button-->
		<script>
			(function () {

				if ('AudioContext' in window || 'webkitAudioContext' in window) {
					var play = function play(audioBuffer) {
						var source = context.createBufferSource();
						source.buffer = audioBuffer;
						source.connect(context.destination);
						source.start();
					};

					var URL = 'sound/button_next.mp3';
					var AudioContext = window.AudioContext || window.webkitAudioContext;
					var context = new AudioContext(); // Make it crossbrowser
					var gainNode = context.createGain();
					gainNode.gain.value = 1; // set volume to 100%
					var playButton = document.querySelector('#_rectangle_4_ek1');
					var yodelBuffer = void 0;

					window.fetch(URL)
						.then(response => response.arrayBuffer())
						.then(arrayBuffer => context.decodeAudioData(arrayBuffer,
							audioBuffer => {
								yodelBuffer = audioBuffer;
							},
							error =>
								console.error(error)
						))

					playButton.onclick = function () {
						return play(yodelBuffer);
					};

					var unmute = document.getElementById('unmute');
					unmute.addEventListener('click', unlock);

					function unlock() {
						console.log("unlocking")
						// create empty buffer and play it
						var buffer = context.createBuffer(1, 1, 22050);
						var source = context.createBufferSource();
						source.buffer = buffer;
						source.connect(context.destination);

						// play the file. noteOn is the older version of start()
						source.start ? source.start(0) : source.noteOn(0);

						// by checking the play state after some time, we know if we're really unlocked
						setTimeout(function () {
							if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
								// Hide the unmute button if the context is unlocked.
								unmute.style.display = "none";
							}
						}, 0);
					}
					unlock();
				}
			}
			)();
		</script>
		<!--end sound button-->









		<script>
			(function () {

				if ('AudioContext' in window || 'webkitAudioContext' in window) {
					var play = function play(audioBuffer) {
						var source = context.createBufferSource();
						source.buffer = audioBuffer;
						source.connect(context.destination);
						source.start();
					};

					var URL = 'sound/3_1.mp3';
					var AudioContext = window.AudioContext || window.webkitAudioContext;
					var context = new AudioContext(); // Make it crossbrowser
					var gainNode = context.createGain();
					gainNode.gain.value = 1; // set volume to 100%
					var playButton = document.querySelector('#play');
					var yodelBuffer = void 0;

					window.fetch(URL)
						.then(response => response.arrayBuffer())
						.then(arrayBuffer => context.decodeAudioData(arrayBuffer,
							audioBuffer => {
								yodelBuffer = audioBuffer;
							},
							error =>
								console.error(error)
						))

					playButton.onclick = function () {
						return play(yodelBuffer);
					};

					var unmute = document.getElementById('unmute');
					unmute.addEventListener('click', unlock);

					function unlock() {
						console.log("unlocking")
						// create empty buffer and play it
						var buffer = context.createBuffer(1, 1, 22050);
						var source = context.createBufferSource();
						source.buffer = buffer;
						source.connect(context.destination);

						// play the file. noteOn is the older version of start()
						source.start ? source.start(0) : source.noteOn(0);

						// by checking the play state after some time, we know if we're really unlocked
						setTimeout(function () {
							if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
								// Hide the unmute button if the context is unlocked.
								unmute.style.display = "none";
							}
						}, 0);
					}
					unlock();
				}
			}
			)();
		</script>
		<!--delay button-->
		<script>
			const btndelay = document.getElementById("_rectangle_4_ek1");

			btndelay.addEventListener("click", function () {
				setTimeout(function () {
					location.replace("ipad_pro_11____4.html");
				}, 1000);
			});
		</script>
		<script>
			document.getElementById("_rectangle_4_ek1").addEventListener("click", myFunction);
			function myFunction() {
				document.getElementById("_rectangle_4_ek1").disabled = true;
			}
		</script>
		<!--end delay button-->





	</div>
	<script>var specialChars = document.querySelectorAll("span.char"); for (var c = 0; c < specialChars.length; c++) { specialChars[c].innerHTML = decodeURIComponent(specialChars[c].innerHTML); }</script>
</body>

</html>