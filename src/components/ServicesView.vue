<template>
    <div class=" p-3 d-flex gp-3 " v-if="arrStream.length > 0">
        <span class="label px-1 py-2 rounded-3 bg-warning text-center me-3">{{ title }}</span>

        <div class="d-flex flex-wrap gap-2 align-items-center">

            <div class="text-center" v-for="stream in arrStream" :key="stream">
                <div class="logos rounded-3" :class="stream.service.themeColorCode ? 'p-1' : ''"
                    :style="{ backgroundColor: stream.service.themeColorCode ?? 'transparent' }">
                    <img :src="stream.service.imageSet.whiteImage" class="rounded-3" alt="">
                </div>
                <span class="price" v-if="stream.price">{{ stream.quality.toUpperCase() }} {{ stream.price.amount ?
                    stream.price.amount + ' €' : ' Prezzo N/D' }}</span>
            </div>
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

@media screen and (max-width: 768px) {
    .logos {
        width: 60px;
    }
}
</style>