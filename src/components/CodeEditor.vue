<template>
	<div class="code-editor">
		<n-divider class="code-editor__title">Code editor</n-divider>

		<div class="code-editor__file" v-if="isFileOpened">
			<codemirror
				v-model="code"
				placeholder="Code goes here..."
				:style="{ height: '100%' }"
				:autofocus="true"
				:indent-with-tab="true"
				:tab-size="2"
				:extensions="extensions"
				@ready="handleReady"
				@change="treeStore.updateBranch"
			/>
		</div>
	</div>
</template>

<script setup>
import { useHierarchyTreeStore } from '@/stores/hierarchyTree'
import { usePathStore } from '@/stores/path'
import { javascript } from '@codemirror/lang-javascript'
import { NDivider } from 'naive-ui'
import { computed, ref, shallowRef, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'

const treeStore = useHierarchyTreeStore()
const pathStore = usePathStore()

const code = ref(``)
const view = shallowRef()
const extensions = [javascript()]

const isFileOpened = computed(() => {
	return pathStore.path.length > 0 && pathStore.path?.at(-1)?.type === 'file'
})

// отображаем редактор при готовности
const handleReady = payload => {
	view.value = payload.view
}

// достаем код из элемента
watch(
	() => pathStore.path,
	() => {
		if (isFileOpened.value) code.value = pathStore.path.at(-1).code
	},
	{ deep: true }
)
</script>

<style scoped lang="scss">
.code-editor {
	&__title {
		padding: 15px 0;
	}

	&__file {
		padding: 10px;
		height: calc(100vh - 118px);
	}
}
</style>
