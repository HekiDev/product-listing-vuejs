<script setup>
import InputText from "@/volt/InputText.vue";
import Button from '@/volt/Button.vue';
import Select from '@/volt/Select.vue';
import InputNumber from '@/volt/InputNumber.vue';
import Popover from '@/volt/Popover.vue';
import { ref } from "vue";

const { categories = [],  } = defineProps({
    categories: { type: Array },
});

const menu = ref(null);

const selectedCategory = defineModel('selectedCategory');
const searchQuery = defineModel('searchQuery');
const priceMin = defineModel('priceMin');    
const priceMax = defineModel('priceMax');

const emit = defineEmits(['getProducts', 'toggleAddDialog'])

const toggle = (event) => {
    menu.value.toggle(event);
};
</script>

<template>
    <div class="flex sm:items-center justify-between mb-4 flex-col sm:flex-col md:flex-row gap-2"> 
        <div class="relative flex-1 w-full">
            <i class="pi pi-search absolute top-1/2 -mt-2 text-surface-400 leading-none start-3 z-1" />
            <InputText
                fluid
                v-model="searchQuery"
                placeholder="Search products..."
                pt:root="ps-10"
            />
        </div>
        <Select
            v-model="selectedCategory"
            :options="categories"
            filter
            optionLabel="name"
            showClear
            placeholder="Select a Category"
            class="w-full md:w-56"
            @change="emit('getProducts')"
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
        <Button type="button" icon="pi pi-dollar" label="Set range" plain @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
        <Popover ref="menu">
            <div class="flex flex-col gap-4">
                <p>Price Range</p>
                <div class="flex flex-col gap-1">
                    <label for="horizontal-buttons" class="font-bold block mb-1"> Max price </label>
                    <InputNumber v-model="priceMin" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :min="0" :max="100000" :step="0.25" mode="currency" currency="USD">
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>
                    <label for="horizontal-buttons" class="font-bold block mb-1"> Max price </label>
                    <InputNumber v-model="priceMax" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :min="0" :max="100000" :step="0.25" mode="currency" currency="USD">
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>
                    </div>
            </div>
        </Popover>
        <div class="flex gap-2 flex-wrap items-center">
            <Button label="Create Product" icon="pi pi-plus" @click="emit('toggleAddDialog')" />
        </div>
    </div>
</template>
