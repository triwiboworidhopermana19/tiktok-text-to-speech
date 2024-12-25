<script lang="ts" setup>
import { onMounted, ref } from 'vue'

let version = ref('')
let username = ref('')

onMounted(async () => {
    version.value = await window.ipcRenderer.invoke('app:version')
    username.value = await window.ipcRenderer.invoke('app:user')

    document.querySelector('#app')?.classList.add('overflow-hidden')
    document.querySelector('body')?.classList.add('bg-gray-200')
})

</script>

<template>

    <div class="flex flex-col mx-4 gap-6">
        <div class="flex w-full justify-center mt-8 gap-3">
            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                    <img src="/logo.svg" alt="" class="w-6 h-6">
                    <div class="font-bold text-xl">
                        Tiktok Text to Speech
                    </div>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <div class="text-sm">Version: {{ version }} Full</div>
                    <button
                        class="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Check
                        for Update</button>
                </div>
            </div>
        </div>

        <div class="flex flex-col mx-3">
            <div class="text-sm font-semibold">This product is licensed to:</div>
            <div class="text-sm ml-2">{{ username }}</div>
        </div>
    </div>
</template>