<template>
	<n-space class="explorer-btns" justify="end">
		<n-button
			v-for="btn in btns"
			:key="btn.type"
			:type="btn.color"
			:title="btn.text"
			:disabled="(btn.type === 3 || btn.type === 4) && !hasSelectedObject"
			:class="btn.class"
			class="icon"
			size="small"
			ghost
			@click="$emit('update:popup-state', true, btn.type)"
		>
			<span v-html="btn.content"></span>
		</n-button>
	</n-space>
</template>

<script setup>
import { NButton, NSpace } from 'naive-ui'
import { defineProps } from 'vue'

defineProps({
	hasSelectedObject: {
		type: Boolean,
		default: false,
	},
})

const btns = [
	{
		type: 1,
		text: 'Создать файл',
		color: 'primary',
		content: '&#43;f',
		class: 'file-explorer__add',
	},
	{
		type: 2,
		text: 'Создать папку',
		color: 'primary',
		content: '&#43;d',
		class: 'file-explorer__add',
	},
	{
		type: 3,
		text: 'Переименовать',
		color: 'info',
		content: '&#9998;',
		class: 'file-explorer__rename',
	},
	{
		type: 4,
		text: 'Удалить',
		color: 'error',
		content: '&#9746;',
		class: 'file-explorer__delete',
	},
]
</script>

<style scoped lang="scss">
.explorer-btns {
	padding-top: 10px;
	padding-right: 10px;

	.icon {
		font-size: 24px;
		width: 42px;
		height: 28px;
	}
}
</style>
