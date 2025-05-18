<script setup>
import Skeleton from '@/volt/Skeleton.vue';
</script>

<template>
    <div class="flex gap-4">
        <div class="flex flex-row flex-wrap" v-for="i in 4" :key="i">
            <div class="w-full flex gap-4 flex-col" >
                <Skeleton width="17rem" height="12rem"></Skeleton>
                <div class="flex-1">
                    <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
                    <Skeleton width="15rem" class="mb-2" borderRadius="16px"></Skeleton>
                </div>
                <div class="flex gap-2 w-[240px] pb-4 justify-between">
                    <Skeleton width="14rem" height="3rem"></Skeleton>
                    <Skeleton width="14rem" height="3rem"></Skeleton>
                </div>
            </div>
        </div>
    </div>
</template>
