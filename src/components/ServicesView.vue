<template>
                    <div class="col-12 p-3 d-flex flex-wrap gap-3 align-items-center" v-if="arrStream.length > 0">
                    <span class="label px-1 py-2 rounded-3 bg-warning">{{ title }}</span>

                    <div class="text-center" v-for="stream in arrStream" :key="stream">
                        <div class="logos rounded-3" :class="stream.service.themeColorCode ? 'p-1' : ''"
                            :style="{ backgroundColor: stream.service.themeColorCode ?? 'transparent' }">
                            <img :src="stream.service.imageSet.whiteImage" class="rounded-3" alt="">
                        </div>
                        <span class="price" v-if="stream.price">{{ stream.quality.toUpperCase() }} {{ stream.price.amount ? stream.price.amount + ' €' : 'N/D' }}</span>
                    </div>
                </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        props: {
            title: String,
            arrStream: Array,
        },
    }
</script>

<style lang="scss" scoped>

.label {
    display: inline-block;
    writing-mode: vertical-lr;
    transform: rotate(180deg);
    font-weight: 700;
    text-transform: uppercase;
    // font-size: 14px;
    color: #1f1f1f;
}

.logos {
    width: 70px;
    aspect-ratio: 1/1;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

}

.price {
    font-size: 12px;
}

</style>