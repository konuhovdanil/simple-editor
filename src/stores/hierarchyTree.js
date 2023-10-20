import { defineStore } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { uuid } from 'vue-uuid'
import { usePathStore } from './path'

export const useHierarchyTreeStore = defineStore('hierarchyTree', () => {
	const pathStore = usePathStore()

	const hierarchyTree = ref({
		name: '',
		id: uuid.v4(),
		type: 'dir',
		extension: '',
		childs: [],
	})

	const activeElementId = ref(null)

	// получаем родительскую ветвь
	const parentBranch = computed(() => {
		return pathStore.parentIdxs.slice(0, -1).reduce((acc, idx) => {
			return acc.childs[idx]
		}, hierarchyTree.value)
	})

	// получаем текущую ветвь
	const currentBranch = computed(() => {
		return pathStore.parentIdxs.reduce((acc, idx) => {
			return acc.childs[idx]
		}, hierarchyTree.value)
	})

	// получаем активный элемент по его id
	const activeElement = computed(() => {
		if (!activeElementId.value) return null

		const element = currentBranch.value.childs.find(
			item => item.id === activeElementId.value
		)

		return element || currentBranch.value
	})

	const updateActiveElementId = id => {
		activeElementId.value = id
	}

	// сохраняем изменения в ЛС
	const saveToLocalStorage = tree => {
		const data = JSON.stringify(tree.childs || [])

		localStorage.setItem('hierarchyTree', data)
	}

	// получаем изменения из ЛС
	const getFromLocalStorage = () => {
		const data = localStorage.getItem('hierarchyTree')

		if (data) hierarchyTree.value.childs = JSON.parse(data) || []
	}

	// создаем новую ветку
	const createBranch = (type, name, extension) => {
		const tree = currentBranch.value
		const isFile = type === 1
		const currentType = isFile ? 'file' : 'dir'
		const data = {
			type: currentType,
			id: uuid.v4(),
			name,
			extension,
		}

		if (isFile) {
			data.code = ''
		} else {
			data.childs = []
		}

		tree.childs.push(data)
	}

	// переименовываем ветвь
	const renameBranch = (name, extension) => {
		const element = activeElement.value

		element.name = name

		if (activeElement.value?.type === 'file') element.extension = extension
	}

	// удаляем ветвь
	const deleteBranch = () => {
		const tree = currentBranch.value.childs.some(
			item => item.id === activeElementId.value
		)
			? currentBranch.value
			: parentBranch.value

		tree.childs = tree.childs.filter(
			child => child.id !== activeElement.value?.id
		)
		activeElementId.value = null
	}

	// обновляем код ветки
	const updateBranch = code => {
		const tree = currentBranch.value

		const fileIdx = tree.childs.findIndex(
			branch => branch.id === activeElementId.value
		)

		tree.childs[fileIdx].code = code
	}

	onMounted(getFromLocalStorage)

	watch(hierarchyTree, saveToLocalStorage, { deep: true })

	return {
		hierarchyTree,
		currentBranch,
		activeElementId,
		activeElement,
		createBranch,
		renameBranch,
		deleteBranch,
		updateBranch,
		updateActiveElementId,
	}
})
