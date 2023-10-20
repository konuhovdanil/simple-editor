<template>
	<div class="editor-view">
		<n-grid cols="4" item-responsive>
			<n-grid-item>
				<file-explorer />
			</n-grid-item>
			<n-grid-item span="0 400:1 600:2 800:3">
				<code-editor />
			</n-grid-item>
		</n-grid>
	</div>
</template>

<script setup>
import CodeEditor from '@/components/CodeEditor'
import FileExplorer from '@/components/FileExplorer'
import { NGrid, NGridItem } from 'naive-ui'
</script>

<style scoped lang="scss">
.editor-view {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: row;
	padding: 0 20px;
}
</style>
