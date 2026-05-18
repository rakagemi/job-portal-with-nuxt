<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
interface Props {
    email?: string
    password?: string
    marqueeText?: string
}
const props = withDefaults(defineProps<Props>(), {
    email: 'john.doe@example.com',
    password: 'password123',
    marqueeText:
        'Jobs Portal Service (Backend) is on progress. Meanwhile, for auth, use browser memory and you can log in using the example account below or register directly.'
})

const isOpen = ref(true)
const copiedField = ref<string | null>(null)

// Posisi draggable toggle "Click Me"
const togglePos = reactive({ x: 24, y: 24 })
const isDragging = ref(false)
const dragOffset = reactive({ x: 0, y: 0 })
const justDragged = ref(false) // bedakan click vs drag
const toggleRef = ref<HTMLElement | null>(null)

async function copyToClipboard(text: string, field: string) {
    try {
        await navigator.clipboard.writeText(text)
    } catch {
        // fallback untuk environment tanpa clipboard API
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
    }
    copiedField.value = field
    setTimeout(() => {
        if (copiedField.value === field) copiedField.value = null
    }, 1600)
}

// Kode lengkap untuk tombol copy global
const fullSnippet = computed(
    () => `{
    email: ${props.email},
    password: ${props.password}
}`
)

function closeWindow() {
    isOpen.value = false
}

function openWindow() {
    if (justDragged.value) return // jangan re-open kalau habis drag
    isOpen.value = true
}

function onDragStart(e: MouseEvent | TouchEvent) {
    const point = 'touches' in e ? e.touches[0] ?? e.changedTouches[0] : e
    if (!point) return
    isDragging.value = true
    justDragged.value = false
    dragOffset.x = point.clientX - togglePos.x
    dragOffset.y = point.clientY - togglePos.y

    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', onDragEnd)
    window.addEventListener('touchmove', onDragMove, { passive: false })
    window.addEventListener('touchend', onDragEnd)
}

function onDragMove(e: MouseEvent | TouchEvent) {
    if (!isDragging.value) return
    if (e.cancelable && 'touches' in e) e.preventDefault()
    const point = 'touches' in e ? e.touches[0] : e
    if (!point) return
    let nx = point.clientX - dragOffset.x
    let ny = point.clientY - dragOffset.y

    // constrain ke viewport (rule #3)
    const el = toggleRef.value
    const w = el?.offsetWidth ?? 120
    const h = el?.offsetHeight ?? 44
    const pad = 8
    nx = Math.max(pad, Math.min(window.innerWidth - w - pad, nx))
    ny = Math.max(pad, Math.min(window.innerHeight - h - pad, ny))

    togglePos.x = nx
    togglePos.y = ny
    justDragged.value = true
}

function onDragEnd() {
    isDragging.value = false
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', onDragEnd)
    window.removeEventListener('touchmove', onDragMove)
    window.removeEventListener('touchend', onDragEnd)
    // reset flag sedikit terlambat → biar click tidak terpicu setelah drag
    setTimeout(() => (justDragged.value = false), 50)
}

// Reposisi kalau window di-resize
function onResize() {
    const el = toggleRef.value
    if (!el) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    togglePos.x = Math.min(togglePos.x, window.innerWidth - w - 8)
    togglePos.y = Math.min(togglePos.y, window.innerHeight - h - 8)
}

onMounted(() => {
    window.addEventListener('resize', onResize)
    // posisi awal: pojok kanan-bawah, biar nggak ketabrakan
    nextTick(() => {
        const w = toggleRef.value?.offsetWidth ?? 130
        const h = toggleRef.value?.offsetHeight ?? 44
        togglePos.x = window.innerWidth - w - 24
        togglePos.y = window.innerHeight - h - 24
    })
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', onDragEnd)
    window.removeEventListener('touchmove', onDragMove)
    window.removeEventListener('touchend', onDragEnd)
})
</script>

<template>
    <Transition name="mac-window">
        <div
            v-if="isOpen" v-motion class="mac-window" :initial="{ opacity: 0, scale: 0.92, y: 24 }" :enter="{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 180, damping: 18, mass: 0.9 }
        }">
            <!-- ── Title bar ───────────────────────────────────────── -->
            <div class="mac-titlebar">
                <!-- Traffic lights -->
                <div class="mac-dots">
                    <UTooltip text="Close" :delay-duration="120">
                        <button class="mac-dot mac-dot--red" aria-label="close" @click="closeWindow">
                            <UIcon name="i-lucide-x" class="mac-dot__icon" />
                        </button>
                    </UTooltip>
                    <UTooltip text="Close" :delay-duration="120">
                        <button class="mac-dot mac-dot--yellow" aria-label="close" @click="closeWindow">
                            <UIcon name="i-lucide-minus" class="mac-dot__icon" />
                        </button>
                    </UTooltip>
                    <UTooltip text="Close" :delay-duration="120">
                        <button class="mac-dot mac-dot--green" aria-label="close" @click="closeWindow">
                            <UIcon name="i-lucide-plus" class="mac-dot__icon" />
                        </button>
                    </UTooltip>
                </div>

                <!-- Marquee header (rule #8) -->
                <div class="mac-marquee" aria-live="polite">
                    <div class="mac-marquee__track">
                        <span class="mac-marquee__item">
                            <UIcon name="i-lucide-sparkles" class="mac-marquee__icon" />
                            {{ props.marqueeText }}
                        </span>
                        <span class="mac-marquee__item" aria-hidden="true">
                            <UIcon name="i-lucide-sparkles" class="mac-marquee__icon" />
                            {{ props.marqueeText }}
                        </span>
                    </div>
                </div>

                <!-- Language pill / global copy -->
                <div class="mac-actions">
                    <span class="mac-lang">
                        <UIcon name="i-simple-icons-typescript" class="mac-lang__icon" />
                        TS
                    </span>
                    <UTooltip :text="copiedField === 'all' ? 'Copied!' : 'Copy all'" :delay-duration="120">
                        <button class="mac-copy-btn" aria-label="copy all" @click="copyToClipboard(fullSnippet, 'all')">
                            <Transition name="swap" mode="out-in">
                                <UIcon
                                    v-if="copiedField === 'all'" key="check" name="i-lucide-check"
                                    class="mac-copy-btn__icon mac-copy-btn__icon--ok" />
                                <UIcon v-else key="copy" name="i-lucide-copy" class="mac-copy-btn__icon" />
                            </Transition>
                        </button>
                    </UTooltip>
                </div>
            </div>

            <!-- ── Code body ───────────────────────────────────────── -->
<div class="mac-body">
    <div class="mac-gutter" aria-hidden="true">
        <span>1</span><span>2</span><span>3</span><span>4</span>
    </div>
    <pre class="mac-code"><code><span class="line"><span class="tok-punct">{</span></span><span
        v-motion
        class="line"
        :initial="{ opacity: 0, x: -8 }"
        :enter="{ opacity: 1, x: 0, transition: { delay: 120 } }"
        >  <span class="tok-key">email</span><span class="tok-punct">:</span> <span class="tok-str">{{ props.email }}</span><span class="tok-punct">,</span><button
            class="line-copy"
            :class="{ 'line-copy--ok': copiedField === 'email' }"
            aria-label="copy email"
            @click="copyToClipboard(props.email, 'email')"
        ><UIcon
            :name="copiedField === 'email' ? 'i-lucide-check' : 'i-lucide-clipboard'"
            class="line-copy__icon"
            /><span class="line-copy__label">{{ copiedField === 'email' ? 'Copied' : 'Copy' }}</span></button></span><span
        v-motion
        class="line"
        :initial="{ opacity: 0, x: -8 }"
        :enter="{ opacity: 1, x: 0, transition: { delay: 220 } }"
        >  <span class="tok-key">password</span><span class="tok-punct">:</span> <span class="tok-str">{{ props.password }}</span><button
            class="line-copy"
            :class="{ 'line-copy--ok': copiedField === 'password' }"
            aria-label="copy password"
            @click="copyToClipboard(props.password, 'password')"
        ><UIcon
            :name="copiedField === 'password' ? 'i-lucide-check' : 'i-lucide-clipboard'"
            class="line-copy__icon"
            /><span class="line-copy__label">{{ copiedField === 'password' ? 'Copied' : 'Copy' }}</span></button></span><span class="line"><span class="tok-punct">}</span></span></code></pre>
</div>
            <div class="mac-glow" aria-hidden="true" />
        </div>
    </Transition>
    <Transition name="toggle-pop">
        <button
            v-if="!isOpen" ref="toggleRef" class="floating-toggle"
            :class="{ 'floating-toggle--dragging': isDragging }"
            :style="{ left: togglePos.x + 'px', top: togglePos.y + 'px' }" @mousedown="onDragStart"
            @touchstart.passive="onDragStart" @click="openWindow">
            <span class="floating-toggle__pulse" aria-hidden="true" />
            <UIcon name="i-lucide-mouse-pointer-click" class="floating-toggle__icon" />
            <span class="floating-toggle__label">Click&nbsp;Me</span>
            <UIcon name="i-lucide-move" class="floating-toggle__grip" />
        </button>
    </Transition>
</template>

<style scoped>
.mac-window {
    position: relative;
    width: min(720px, 100%);
    margin-inline: auto;
    border-radius: 14px;
    background: linear-gradient(180deg, #1f2230 0%, #14161f 100%);
    box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.06) inset,
        0 30px 60px -20px rgba(0, 0, 0, 0.55),
        0 12px 24px -12px rgba(0, 0, 0, 0.45);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    isolation: isolate;
}

/* subtle ambient glow */
.mac-glow {
    position: absolute;
    inset: -40%;
    z-index: -1;
    background:
        radial-gradient(circle at 20% 0%, rgba(255, 95, 86, 0.18), transparent 40%),
        radial-gradient(circle at 80% 100%, rgba(39, 201, 63, 0.14), transparent 45%);
    filter: blur(40px);
    pointer-events: none;
}

/* ────────────────────────────────────────────────────────────
   TITLE BAR
   ──────────────────────────────────────────────────────────── */
.mac-titlebar {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    background: linear-gradient(180deg, #2a2d3a 0%, #1d1f2a 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.mac-dots {
    display: flex;
    gap: 8px;
}

.mac-dot {
    position: relative;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.35);
}

.mac-dot:hover {
    transform: scale(1.12);
}

.mac-dot:active {
    transform: scale(0.92);
}

.mac-dot--red {
    background: #ff5f57;
}

.mac-dot--yellow {
    background: #febc2e;
}

.mac-dot--green {
    background: #28c840;
}

.mac-dot__icon {
    width: 9px;
    height: 9px;
    color: rgba(0, 0, 0, 0.55);
    opacity: 0;
    transition: opacity 0.18s ease;
}

.mac-dots:hover .mac-dot__icon {
    opacity: 1;
}

/* ────────────────────────────────────────────────────────────
   MARQUEE (rule #8)
   ──────────────────────────────────────────────────────────── */
.mac-marquee {
    position: relative;
    overflow: hidden;
    mask-image: linear-gradient(90deg,
            transparent 0,
            #000 32px,
            #000 calc(100% - 32px),
            transparent 100%);
}

.mac-marquee__track {
    display: inline-flex;
    white-space: nowrap;
    animation: marquee 28s linear infinite;
    will-change: transform;
}

.mac-marquee:hover .mac-marquee__track {
    animation-play-state: paused;
}

.mac-marquee__item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding-right: 48px;
    font-size: 13.5px;
    letter-spacing: 0.2px;
    color: rgba(229, 231, 235, 0.85);
    font-style: italic;
}

.mac-marquee__icon {
    width: 14px;
    height: 14px;
    color: #fbbf24;
    flex-shrink: 0;
}

@keyframes marquee {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-50%);
    }
}

/* ────────────────────────────────────────────────────────────
   ACTIONS (lang pill + copy all)
   ──────────────────────────────────────────────────────────── */
.mac-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.mac-lang {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: #cbd5e1;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.mac-lang__icon {
    width: 12px;
    height: 12px;
    color: #3178c6;
}

.mac-copy-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #cbd5e1;
    cursor: pointer;
    transition: background 0.18s ease, transform 0.18s ease, color 0.18s ease;
}

.mac-copy-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
}

.mac-copy-btn:active {
    transform: translateY(0);
}

.mac-copy-btn__icon {
    width: 14px;
    height: 14px;
}

.mac-copy-btn__icon--ok {
    color: #34d399;
}

/* ────────────────────────────────────────────────────────────
   BODY + CODE
   ──────────────────────────────────────────────────────────── */
.mac-body {
    display: grid;
    grid-template-columns: 44px 1fr;
    background:
        radial-gradient(ellipse at top left,
            rgba(99, 102, 241, 0.06),
            transparent 60%),
        #14161f;
    padding: 18px 0 22px;
}

.mac-gutter {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-right: 14px;
    font-size: 13px;
    line-height: 1.85;
    color: rgba(148, 163, 184, 0.4);
    user-select: none;
}

.mac-code {
    margin: 0;
    padding: 0 22px 0 4px;
    font-size: 13.5px;
    line-height: 1.85;
    color: #e2e8f0;
    overflow-x: auto;
}

.mac-code code {
    display: block;
}

.line {
    display: flex;
    align-items: center;

    min-height: 1.85em;
}

/* tokens */
.tok-key {
    color: #f472b6;
}

.tok-str {
    color: #fde68a;
}

.tok-str::before {
    content: "'";
    color: #fde68a;
}

.tok-str::after {
    content: "'";
    color: #fde68a;
}

.tok-punct {
    color: #94a3b8;
}

/* ────────────────────────────────────────────────────────────
   LINE-LEVEL COPY (rule #7)
   ──────────────────────────────────────────────────────────── */
.line-copy {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px 3px 7px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: rgba(203, 213, 225, 0.7);
    font-size: 11px;
    cursor: pointer;
    opacity: 0;
    transform: translateX(4px);
    transition:
        opacity 0.2s ease,
        transform 0.2s ease,
        background 0.18s ease,
        color 0.18s ease,
        border-color 0.18s ease;
}

.mac-body:hover .line-copy,
.line-copy:focus-visible {
    opacity: 1;
    transform: translateX(0);
}

.line-copy:hover {
    background: rgba(99, 102, 241, 0.15);
    color: #c7d2fe;
    border-color: rgba(99, 102, 241, 0.4);
}

.line-copy--ok {
    opacity: 1 !important;
    transform: translateX(0) !important;
    background: rgba(52, 211, 153, 0.14);
    border-color: rgba(52, 211, 153, 0.45);
    color: #6ee7b7;
}

.line-copy__icon {
    width: 12px;
    height: 12px;
}

.line-copy__label {
    letter-spacing: 0.3px;
}

/* ────────────────────────────────────────────────────────────
   TRANSITIONS — window
   ──────────────────────────────────────────────────────────── */
.mac-window-enter-active,
.mac-window-leave-active {
    transition:
        opacity 0.35s ease,
        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mac-window-enter-from {
    opacity: 0;
    transform: scale(0.94) translateY(20px);
}

.mac-window-leave-to {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
    filter: blur(4px);
}

/* swap (copy ↔ check) */
.swap-enter-active,
.swap-leave-active {
    transition: all 0.18s ease;
}

.swap-enter-from {
    opacity: 0;
    transform: scale(0.6) rotate(-20deg);
}

.swap-leave-to {
    opacity: 0;
    transform: scale(0.6) rotate(20deg);
}

/* ────────────────────────────────────────────────────────────
   FLOATING TOGGLE "Click Me" (rule #3)
   ──────────────────────────────────────────────────────────── */
.floating-toggle {
    position: fixed;
    z-index: 50;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 11px 18px 11px 14px;
    border-radius: 999px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
    background-size: 200% 200%;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    border: none;
    cursor: grab;
    box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.2) inset,
        0 10px 30px -8px rgba(139, 92, 246, 0.6),
        0 4px 12px -4px rgba(0, 0, 0, 0.3);
    transition:
        transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.2s ease;
    animation: gradient-shift 6s ease-in-out infinite;
    user-select: none;
    touch-action: none;
}

.floating-toggle:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.25) inset,
        0 16px 40px -10px rgba(139, 92, 246, 0.7),
        0 6px 16px -4px rgba(0, 0, 0, 0.35);
}

.floating-toggle:active,
.floating-toggle--dragging {
    cursor: grabbing;
    transform: scale(0.97);
    transition: transform 0.08s ease;
}

.floating-toggle__icon {
    width: 16px;
    height: 16px;
    animation: wiggle 1.8s ease-in-out infinite;
}

.floating-toggle__grip {
    width: 13px;
    height: 13px;
    opacity: 0.7;
    margin-left: 2px;
}

.floating-toggle__label {
    position: relative;
    z-index: 1;
}

.floating-toggle__pulse {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: inherit;
    opacity: 0.55;
    animation: pulse-ring 2.2s ease-out infinite;
    z-index: -1;
}

@keyframes pulse-ring {
    0% {
        transform: scale(1);
        opacity: 0.55;
    }

    70% {
        transform: scale(1.35);
        opacity: 0;
    }

    100% {
        transform: scale(1.35);
        opacity: 0;
    }
}

@keyframes gradient-shift {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}

@keyframes wiggle {

    0%,
    100% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(-12deg) scale(1.1);
    }

    50% {
        transform: rotate(8deg);
    }

    75% {
        transform: rotate(-4deg);
    }
}

/* toggle entrance/exit */
.toggle-pop-enter-active {
    transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toggle-pop-leave-active {
    transition: all 0.25s ease;
}

.toggle-pop-enter-from {
    opacity: 0;
    transform: scale(0.4) rotate(-20deg);
}

.toggle-pop-leave-to {
    opacity: 0;
    transform: scale(0.6);
}

/* ────────────────────────────────────────────────────────────
   Reduced motion
   ──────────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {

    .mac-marquee__track,
    .floating-toggle__icon,
    .floating-toggle__pulse,
    .floating-toggle {
        animation: none !important;
    }
}

/* ────────────────────────────────────────────────────────────
   Responsive
   ──────────────────────────────────────────────────────────── */
@media (max-width: 540px) {
    .mac-titlebar {
        grid-template-columns: auto 1fr;
        gap: 10px;
    }

    .mac-actions {
        grid-column: 1 / -1;
        justify-self: end;
    }

    .mac-code {
        font-size: 12.5px;
    }

    .line-copy {
        opacity: 1;
        transform: translateX(0);
    }

    /* mobile: selalu tampak */
}
</style>