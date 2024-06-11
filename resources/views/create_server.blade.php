<x-guest-layout>
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('create_private_server') }}">
        @csrf
        <div class="mt-4">
            <x-input-label for="server_name" value="Server Name" />

            <x-text-input id="server_name" class="block mt-1 w-full"
                          type="server_name"
                          name="server_name"
                          required autocomplete="current-password" />
        </div>

        <div class="flex items-center justify-end mt-4">
            <button class="ms-4 inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150" type="submit">
                Create
            </button>
        </div>
    </form>
</x-guest-layout>
