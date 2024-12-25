<script lang="ts" setup>
import { ref } from 'vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'


const isLoading = ref(false)

const username = defineModel({ type: String, default: '' })

const errorMessage = ref('')

const handleSubmit = async () => {
  isLoading.value = true

  const [data, error] = await window.ipcRenderer.invoke('submit:username', {
    username: username.value
  })

  isLoading.value = false

  if (error) {
    errorMessage.value = error

    return
  }

  console.log('Connected to roomId: ', data.roomId)
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Tiktok Text to Speech
      </h2>
      <p class="mt-1 text-center text-sm font-normal leading-9 tracking-tight text-gray-500">Silahkan mengisi username
        dibawah ini untuk menggunakan aplikasi.</p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="license" class="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div class="relative mt-2 rounded-md shadow-sm">
              <input type="text" name="username" id="username" required
                class="block w-full rounded-md border-0 p-1.5 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                :class="{
                  'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 pr-10': errorMessage.length !== 0,
                  'text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600': errorMessage.length === 0
                }" placeholder="Username" v-model="username" @input="errorMessage = ''" />
              <div v-show="errorMessage.length !== 0"
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            </div>
            <p v-show="errorMessage.length !== 0" class="mt-2 text-sm text-red-600" id="email-error">{{ errorMessage }}
            </p>
          </div>

          <div>
            <button type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Start</button>
            <div class='hidden flex space-x-2 justify-center items-center bg-white dark:invert loading-animation'>
              <span class='sr-only'>Loading...</span>
              <div class='h-4 w-4 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]'>
              </div>
              <div class='h-4 w-4 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]'>
              </div>
              <div class='h-4 w-4 bg-indigo-400 rounded-full animate-bounce'></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
