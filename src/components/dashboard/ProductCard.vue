<script setup>
import Button from '@/volt/Button.vue';
import DangerButton from '@/volt/DangerButton.vue';
import Tag from '@/volt/Tag.vue';
import Card from '@/volt/Card.vue';

const { product_id = 0, title = '', category_name = '', created_at = '', description = '', price = '', image_url = '' } = defineProps({
    product_id: { type: Number },
    title: { type: String },
    category_name: { type: String },
    created_at: { type: String },
    description: { type: String },
    price: { type: Number },
    image_url: { type: String },
});

const emit = defineEmits(['editProduct', 'deleteProduct'])

const formattedDate = (rawDate) => {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(rawDate))
}
</script>

<template>
    <Card>
        <template #header>
            <div class="h-48 w-full overflow-hidden rounded-t-md">
                <img
                :src="image_url"
                alt="Golden Nectar Elixir"
                class="w-full h-full object-cover"
                />
            </div>
        </template>
        <template #title>
            <div class="flex items-center gap-2 justify-between">
                <p class="">{{ title }} <Tag icon="pi pi-tag" :value="category_name"></Tag></p>
                <p class="self-start text-lg">${{ price }}</p>
            </div>
            <p class="flex-none text-sm text-surface-500 mt-1">Added on: {{ formattedDate(created_at) }}</p>
        </template>
        <template #content>
            <div class="flex flex-col h-full gap-2">
                <div class="flex-none">{{ description }}</div>
            </div>
        </template>
        <template #footer>
            <div class="flex gap-2 mt-1">
                <Button label="Edit" severity="secondary" variant="outlined" class="w-full" @click="emit('editProduct', product_id)" />
                <DangerButton label="Delete" class="w-full" @click="emit('deleteProduct', product_id)" />
            </div>
        </template>
    </Card>
</template>
