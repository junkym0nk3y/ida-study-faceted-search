<template>
    <div :class="$style.PrintHeader">
        <svg-icon
            :class="$style.logo"
            name="ida-logo"
        />

        <div :class="$style.title">учебные материалы</div>

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
        position: relative;
        display: flex;
        align-items: center;
        height: 6.2rem;
        background: $base-900;

        &:after {
            content: "";
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
        }
    }

    .logo {
        flex-shrink: 0;
        width: 6.8rem;
        height: 3.2rem;
        margin-right: 8.4rem;
        color: #fff;
    }

    .phone,
    .title {
        text-transform: uppercase;
        font-size: 1.2rem;
        font-weight: 600;
        font-style: normal;
        line-height: 1;
        letter-spacing: .015em;
        color: #fff;
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
                color: $base-900;
            }
        }
    }
</style>
