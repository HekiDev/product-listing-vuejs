<script setup>
import { onMounted, ref, watch } from "vue";
import { useProductStore } from '@/stores/productStore';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import debounce from 'lodash/debounce'
import ProductFilter from './ProductFilter.vue';
import ProductCard from './ProductCard.vue';
import ProductCardSkeleton from '@/components/ProductCardSkeleton.vue';
import ProductForm from './ProductForm.vue';
import Dialog from '@/volt/Dialog.vue';
import Button from '@/volt/Button.vue';

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
            <ProductForm
                v-model:title="form.title"
                v-model:price="form.price"
                v-model:description="form.description"
                v-model:category="form.category"
                v-model:images="form.images"
                :errors="errors"
                :categories="productStore.categories"
                :isEditing="isEditing"
            />
            <template #footer>
                <Button label="Cancel" class="px-10" outlined @click="productDialog = false" autofocus />
                <Button :label="isAdding ? 'Create' : 'Update'" :loading="isSubmitting" class="px-10" @click="isAdding ? handleAddProduct() : handleUpdateProduct()" autofocus />
            </template>
        </Dialog>
    </div>
</template>
