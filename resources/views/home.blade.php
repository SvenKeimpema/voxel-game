<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en" data-bs-theme-mode="dark">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    @vite(["resources/css/main.css", "resources/css/server_menu.css"])
</head>
<body>
<!-- Sidebar -->
<div class="container">
    <div class="w3-sidebar w3-light-grey w3-bar-block">
        <h3 class="w3-bar-item">Menu</h3>
        <a href="#" class="w3-bar-item w3-button">Play</a>
        <a href="/friends" class="w3-bar-item w3-button">Friends</a>
        <a href="/shop" class="w3-bar-item w3-button">Shop</a>
        <a href="/settings" class="w3-bar-item w3-button">Settings</a>

        @if (!Auth::guest())
        <a href="/create_server" class="w3-bar-item w3-button">Create Private Server</a>
        <a href="/join_server" class="w3-bar-item w3-button">Join Private Server</a>
        @endif

        @if (Auth::guest())
            <a href="/login" class="w3-bar-item w3-button">Login</a>
        @else
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <input value="Logout" type="submit" class="w3-bar-item w3-button">
            </form>
        @endif
    </div>

    <!-- Page Content -->
    <div class="page">

        <div class="grid-server-list-title">
            <h1>Join a server</h1>
        </div>

        <div class="server-container">

            <form action="#" method="post">
                <div class="grid-title">Available Servers</div>
                <div class="list">
                    <ul class="server-grid w3-ul w3-border">
                        @foreach($servers as $server)
                        <li class="selectable-server">
                            <span class="server-name">{{$server->name}}</span>
                            <span class="server-players">0/{{$server->user_limit}}</span>
                        </li>
                        @endforeach
                        <!-- Add more server items here as needed -->
                    </ul>
                </div>
                <input class="server-submit-btn" type="submit" value="Join">
            </form>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous" type="javascript"></script>
</body>
</html>
