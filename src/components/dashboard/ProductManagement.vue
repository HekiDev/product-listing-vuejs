<script setup>
import { onMounted, ref, watch } from "vue";
import { useProductStore } from '@/stores/productStore';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import debounce from 'lodash/debounce'
import ProductFilter from './ProductFilter.vue';
import ProductCard from './ProductCard.vue';
import ProductCardSkeleton from '@/components/ProductCardSkeleton.vue';
import Dialog from '@/volt/Dialog.vue';
import InputText from "@/volt/InputText.vue";
import InputNumber from '@/volt/InputNumber.vue';
import Textarea from '@/volt/Textarea.vue';
import Button from '@/volt/Button.vue';
import Select from '@/volt/Select.vue';
import Message from '@/volt/Message.vue';

const productStore = useProductStore();
const toast = useToast();
const confirm = useConfirm();

const searchQuery = ref("");
const loading = ref(true);
const selectedCategory = ref({});
const categoryId = ref(0);
const priceMin = ref(0);
const priceMax = ref(100000);
const productDialog = ref(false);
const form = ref({
    title: '',
    description: '',
    price: 0,
    category: null,
    images: '',
});
const errors = ref([]);
const isAdding = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const selectedProductId = ref(0);

const handleGetProducts = debounce(() => {
    loading.value = true;
    categoryId.value = selectedCategory.value?.id ?? 0;
    productStore.getProducts(searchQuery.value, categoryId.value, priceMin.value, priceMax.value)
    .then(() => {
        loading.value = false;
    })
}, 500);

const handleAddProduct = () => {
    isSubmitting.value = true;
    productStore.createProduct(form.value)
    .then(() => {
        productDialog.value = false;
        handleGetProducts();
        toast.add({ severity: 'success', summary: 'Product created successfully', life: 3000 });
    })
    .catch(errs => {
        errors.value = errs;
    })
    .finally(() => {
        isSubmitting.value = false;
    })
};

const handleUpdateProduct = () => {
    isSubmitting.value = true;
    productStore.updateProduct(selectedProductId.value, form.value)
    .then(() => {
        productDialog.value = false;
        handleGetProducts();
        toast.add({ severity: 'success', summary: 'Product updated successfully', life: 3000 });
    })
    .catch(errs => {
        errors.value = errs;
    })
    .finally(() => {
        isSubmitting.value = false;
    })
};

const toggleAddDialog = () => {
    isAdding.value = true;
    isEditing.value = false;
    productDialog.value = true;
    form.value = {
        title: '',
        description: '',
        price: 0,
        category: null,
        images: '',
    };
    errors.value = [];
}

const toggleEditDialog = (productId) => {
    selectedProductId.value = productId;
    isAdding.value = false;
    isEditing.value = true;
    productStore.getProduct(productId)
    .then(product => {
        productDialog.value = true;
        form.value = {
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            images: product.images.join(','),
        };
    })
    errors.value = [];
}

const toggleDeleteDialog = (productId) => {
    selectedProductId.value = productId;
    confirm.require({
        message: 'Are you sure you want to delete this product?',
        header: 'Confirmation',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptProps: {
            label: 'Confirm',
        },
        accept: () => {
            productStore.deleteProduct(productId)
            .then(() => {
                handleGetProducts();
                toast.add({ severity: 'success', summary: 'Product deleted successfully', life: 3000 });
            })
        },
        reject: () => {}
    });
}

onMounted(() => {
    Promise.all([
        productStore.getProducts()
        .then(() => {
            loading.value = false;
        }),
        productStore.getCategories()
    ]);
});

watch(searchQuery, () => {
    handleGetProducts();
});

watch(priceMin, (val) => {
    priceMin.value = val ?? 0;
    handleGetProducts();
})

watch(priceMax, (val) => {
    priceMax.value = val ?? 0;
    handleGetProducts();
})
</script>

<template>
    <div
        class="bg-surface-0 dark:bg-surface-900 p-6 rounded-md border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
    >
        <ProductFilter
            v-model:searchQuery="searchQuery"
            v-model:selectedCategory="selectedCategory"
            v-model:priceMin="priceMin"
            v-model:priceMax="priceMax"
            :categories="productStore.categories"
            @getProducts="handleGetProducts"
            @toggleAddDialog="toggleAddDialog"
        />
        <div v-if="loading">
            <ProductCardSkeleton />
        </div>
        <div v-else-if="productStore.products.length === 0">
            <div class="flex flex-col items-center justify-center gap-4">
                <i class="pi pi-info-circle text-5xl text-primary"></i>
                <p class="text-xl text-surface-500">No products found</p>
            </div>
        </div>
        <div v-else class="grid md:grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] sm:grid-cols-[repeat(auto-fill,minmax(1fr,_1fr))] gap-4">
            <ProductCard
                v-for="product in productStore.products"
                :key="product.id"
                :product_id="product.id"
                :title="product.title"
                :category_name="product.category.name"
                :created_at="product.creationAt"
                :description="product.description"
                :price="product.price"
                :image_url="product.images[0]"
                @editProduct="toggleEditDialog"
                @deleteProduct="toggleDeleteDialog"
            />
        </div>
        <Dialog 
            v-model:visible="productDialog"
            :draggable="false"
            modal
            :header="isAdding ? 'Create Product' : 'Edit Product'"
            :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
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
                        <InputText id="username" v-model="form.title" aria-describedby="username-help" />
                    </div>
                    <div class="flex-1 flex flex-col gap-2">
                        <label class="font-medium">Price</label>
                        <InputNumber v-model="form.price" inputId="currency-us" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                </div>
                <div class="flex flex-col gap-3">
                    <label class="font-medium">Description</label>
                    <Textarea v-model="form.description" rows="3" cols="5" class="resize-none" />
                </div>
                <div class="flex-1 flex flex-col gap-2">
                    <label>Category</label>
                    <Select
                        v-model="form.category"
                        :options="productStore.categories"
                        filter
                        optionLabel="name"
                        showClear
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
                    <Textarea v-model="form.images" rows="3" cols="5" class="resize-none" />
                    <label class="text-sm">To add multiple image url, separate them with a comma. Ex: https://example.com/image1.jpg,https://example.com/image2.jpg</label>
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" class="px-10" outlined @click="productDialog = false" autofocus />
                <Button :label="isAdding ? 'Create' : 'Update'" :loading="isSubmitting" class="px-10" @click="isAdding ? handleAddProduct() : handleUpdateProduct()" autofocus />
            </template>
        </Dialog>
    </div>
</template>
