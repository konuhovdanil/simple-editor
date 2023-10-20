import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useHierarchyTreeStore } from './hierarchyTree'

export const usePathStore = defineStore('path', () => {
	const treeStore = useHierarchyTreeStore()
	const path = ref([])

	// проверяем что активного элемента нет
	const isRootDir = computed(() => path.value.length === 0)

	// получаем путь из папок
	const dir = computed(() => {
		if (isRootDir.value) return []

		const resultPath = path.value

		if (resultPath.at(-1).type === 'dir') return path.value

		return resultPath.slice(0, -1)
	})

	// ищем индексы всего активного пути
	const parentIdxs = computed(() => {
		const idxs = []

		if (dir.value.length > 0) {
			dir.value.reduce((acc, dir) => {
				const idx = acc.findIndex(item => item.id === dir.id)

				idxs.push(idx)
				return acc[idx].childs
			}, treeStore.hierarchyTree.childs)
		}

		return idxs
	})

	const updatePath = newPath => {
		path.value = newPath
	}

	return {
		path,
		isRootDir,
		updatePath,
		parentIdxs,
	}
})
