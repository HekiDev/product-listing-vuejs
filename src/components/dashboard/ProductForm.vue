<script setup>
import InputText from "@/volt/InputText.vue";
import Select from '@/volt/Select.vue';
import InputNumber from '@/volt/InputNumber.vue';
import Message from '@/volt/Message.vue';
import Textarea from '@/volt/Textarea.vue';
import { watch } from "vue";

const { errors = [], categories = [], isEditing = false } = defineProps({
    errors: { type: Array },
    categories: { type: Array },
    isEditing: { type: Boolean },
});

const title = defineModel('title');
const price = defineModel('price');
const description = defineModel('description');
const category = defineModel('category');
const images = defineModel('images');
</script>

<template>
    <div class="flex flex-col justify-center gap-3 py-3">
        <Message severity="error" class="p-2" v-if="errors.length > 0">
            <div class="flex flex-col gap-2">
                <div class="flex gap-2 items-center">
                    <i class="pi pi-exclamation-circle text-2xl text-error"></i>
                    <p>Something went wrong!</p>
                </div>
                <ul class="list-disc list-inside">
                    <li v-for="error in errors" class="capitalize">{{ error }}</li>
                </ul>
            </div>
        </Message>
        <div class="flex gap-3">
            <div class="flex-1 flex flex-col gap-2">
                <label class="font-medium">Title</label>
                <InputText id="username" v-model="title" aria-describedby="username-help" />
            </div>
            <div class="flex-1 flex flex-col gap-2">
                <label class="font-medium">Price</label>
                <InputNumber v-model="price" inputId="currency-us" mode="currency" currency="USD" locale="en-US" fluid />
            </div>
        </div>
        <div class="flex flex-col gap-3">
            <label class="font-medium">Description</label>
            <Textarea v-model="description" rows="3" cols="5" class="resize-none" />
        </div>
        <div class="flex-1 flex flex-col gap-2">
            <label>Category</label>
            <Select
                v-model="category"
                :options="categories"
                filter
                optionLabel="name"
                :disabled="isEditing"
                placeholder="Select a Category"
            >
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center gap-2">
                        <div>{{ slotProps.value.name }}</div>
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex items-center gap-2">
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Select>
        </div>
        <div class="flex flex-col gap-3">
            <label class="font-medium">Images (URL)</label>
            <Textarea v-model="images" rows="3" cols="5" class="resize-none" />
            <label class="text-sm">To add multiple image url, separate them with a comma. Ex: https://example.com/image1.jpg,https://example.com/image2.jpg</label>
        </div>
    </div>
</template>
