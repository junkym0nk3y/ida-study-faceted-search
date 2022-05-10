<template>
    <div :class="$style.PrintHeader">
        <svg-icon
            :class="$style.logo"
            name="ida-logo"
        />

        <div :class="$style.title">технический отчет <slot></slot></div>

        <div :class="$style.phoneWrapper">
            <div :class="$style.phone">
                {{ phone }}
            </div>
            <span>
                <svg-icon
                    name="arrow"
                />
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PrintHeader',

        data() {
            return {
                phone: '+7 495 966 40 21',
            };
        },
    };
</script>

<style lang="scss" module>
    .PrintHeader {
        display: flex;
        align-items: center;
        height: 6.2rem;
        margin-bottom: 4rem;
    }

    .logo {
        flex-shrink: 0;
        width: 6.8rem;
        height: 3.2rem;
        margin-right: 8.4rem;
        color: #000;
    }

    .title {
        display: flex;
        flex: 1;
    }

    .phone {
        height: 100%;
        padding: 5px 12px 3px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, .18);
    }

    .phone,
    .title {
        text-transform: uppercase;
        font-size: 1.2rem;
        font-weight: 500;
        font-style: normal;
        line-height: 1;
        letter-spacing: .015em;
        color: #000;
    }

    .phoneWrapper {
        display: flex;
        align-items: center;
        flex-flow: row nowrap;

        span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background: #fff;

            svg {
                width: 100%;
                height: 6px;
                color: #000;
            }
        }
    }
</style>
