<template>
	<div class="file-explorer">
		<explorer-buttons
			:has-selected-object="!pathStore.isRootDir"
			@update:popup-state="updatePopup"
		/>

		<n-divider>File explorer</n-divider>

		<div
			class="file-explorer__dir"
			:class="{ active: pathStore.isRootDir }"
			@click.stop="resetActiveElements"
		>
			<file-item
				v-for="item in treeStore.hierarchyTree.childs"
				:key="item.id"
				:id="item.id"
				:name="item.name"
				:extension="item.extension"
				:type="item.type"
				:code="item.code"
				:childs="item.childs"
				@update:path="setActiveElement"
			/>
		</div>

		<teleport to="body">
			<action-popup
				:popup-state="popupState"
				:old-filename="filename"
				@update:popup-state="updatePopup"
				@update:hierarchy-tree="updateHierarchyTree"
			/>
		</teleport>
	</div>
</template>

<script setup>
import ActionPopup from '@/components/ActionPopup'
import ExplorerButtons from '@/components/ExplorerButtons'
import FileItem from '@/components/FileItem'
import { useHierarchyTreeStore } from '@/stores/hierarchyTree'
import { usePathStore } from '@/stores/path'
import { NDivider } from 'naive-ui'
import { computed, reactive } from 'vue'

const treeStore = useHierarchyTreeStore()
const pathStore = usePathStore()

const popupState = reactive({
	show: false,
	action: 1,
})

const filename = computed(() => {
	if (!treeStore.activeElement) return ''

	const file = treeStore.activeElement

	return file.extension.length > 0
		? `${file.name}.${file.extension}`
		: file.name
})

const updatePopup = (state, action) => {
	popupState.show = state
	popupState.action = action
}

// сбрасываем путь при клике вне элементов
const resetActiveElements = e => {
	if (e.target.classList.contains('file-explorer__dir')) {
		treeStore.updateActiveElementId(null)
		pathStore.updatePath([])
	}
}

const setActiveElement = (dirs = [], id = null) => {
	if (id) treeStore.updateActiveElementId(id)

	pathStore.updatePath(dirs)
}

// обновляем иерархическое древо
const updateHierarchyTree = filename => {
	const element = treeStore.activeElement
	const hasExtension = popupState.action === 1 || element?.type === 'file'
	const splittedFilename = filename.split('.')
	const extension =
		hasExtension && splittedFilename.length > 1 ? splittedFilename.at(-1) : ''
	const name =
		hasExtension && splittedFilename.length > 1
			? splittedFilename.slice(0, -1).join('')
			: filename
	// ищем соседей с одинаковым именем и расширением
	const hasEqualSibiling = treeStore.currentBranch.childs.some(
		item => item.name === name && item.extension === extension
	)

	if ((filename.length > 0 && !hasEqualSibiling) || popupState.action === 4) {
		switch (popupState.action) {
			// rename action
			case 3: {
				treeStore.renameBranch(name, extension)
				break
			}
			// delete action
			case 4: {
				treeStore.deleteBranch()
				break
			}
			// (1 - create file / 2 - create dir) action
			default: {
				treeStore.createBranch(popupState.action, name, extension)
			}
		}
	}
}
</script>

<style scoped lang="scss">
.file-explorer {
	border-right: 1px solid rgb(239, 239, 245);
	height: 100%;

	&__dir {
		padding: 10px;
		height: calc(100vh - 135px);
		border: 1px solid transparent;

		&.active {
			border: 1px solid #2080f0;
		}
	}
}
</style>
