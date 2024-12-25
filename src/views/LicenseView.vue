<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const isLoading = ref(false)

const open = ref(true)

const license = defineModel({ type: String, default: '' })

const errorMessage = ref('')

const handleSubmit = async () => {
    isLoading.value = true

    const [_, error] = await window.ipcRenderer.invoke('submit:license', {
        license: license.value
    })

    isLoading.value = false

    if (error) {
        errorMessage.value = error

        return
    }

    router.push({ path: '/' })

}
</script>

<template>
    <TransitionRoot as="template" :show="open">
        <Dialog class="relative z-10" @close="open = false" :initial-focus="$refs.form">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div class="sm:flex sm:items-start">
                                <div
                                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon class="h-6 w-6 text-yellow-600" aria-hidden="true" />
                                </div>
                                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                                        Kode Aktivasi
                                    </DialogTitle>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-500">
                                            Anda memerlukan kode aktivasi untuk menggunakan aplikasi. Silahkan mengisi
                                            kode aktivasi untuk melanjutkan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Tiktok Text to Speech
            </h2>
            <p class="mt-1 text-center text-sm font-normal leading-9 tracking-tight text-gray-500">
                Silahkan mengisi kode aktivasi dibawah ini untuk menggunakan aplikasi.
            </p>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                <form ref="form" class="space-y-6" @submit.prevent="handleSubmit">
                    <div>
                        <label for="license" class="block text-sm font-medium leading-6 text-gray-900">Kode
                            Aktivasi
                        </label>
                        <div class="relative mt-2 rounded-md shadow-sm">
                            <input type="text" name="license" id="license"
                                required
                                class="block w-full rounded-md border-0 p-1.5 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                :class="{ 
                                    'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 pr-10': errorMessage.length !== 0,
                                    'text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600': errorMessage.length === 0 
                                }"
                                placeholder="Kode aktivasi" v-model="license" @input="errorMessage = ''" />
                            <div v-show="errorMessage.length !== 0" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
                            </div>
                        </div>
                        <p v-show="errorMessage.length !== 0" class="mt-2 text-sm text-red-600" id="email-error">{{ errorMessage }}</p>
                    </div>

                    <div>
                        <button type="submit" v-show="!isLoading"
                            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Start</button>
                        <div v-show="isLoading"
                            class='flex space-x-2 justify-center items-center bg-white dark:invert'>
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