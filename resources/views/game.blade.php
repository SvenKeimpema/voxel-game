<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Voxel Game</title>
{{-- we want to load the echo server first, this will allow us to communicate with js->php and php->js --}}
    @vite(["resources/js/echo.js"])
{{-- Link the game css and js using vite--}}
    @vite(["resources/css/game/main.css", "resources/js/voxel_game/main.js"])
</head>
<body>
<canvas id="game_screen"></canvas>
<div id="hud">
    <a id="fps"></a><br>
    <a id="pos"></a>
</div>
<p id="world_uuid" hidden>{{$uuid}}</p>
<p id="seed" hidden>{{$world_seed}}</p>
</body>
</html>
